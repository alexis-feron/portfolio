'use client';

import { animate, useReducedMotion, useSpring } from 'framer-motion';
import { useInViewport } from 'hooks';
import {
  CSSProperties,
  MutableRefObject,
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  AmbientLight,
  Color,
  DirectionalLight,
  Group,
  Light,
  Material,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshDepthMaterial,
  Object3D,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  SRGBColorSpace,
  Scene,
  ShaderMaterial,
  Texture,
  Vector3,
  WebGLRenderTarget,
  WebGLRenderer,
} from 'three';
import { HorizontalBlurShader, VerticalBlurShader } from 'three-stdlib';
import { resolveSrcFromSrcSet } from 'utils/image';
import { classes, cssProps, numToMs } from 'utils/style';
import {
  cleanRenderer,
  cleanScene,
  modelLoader,
  removeLights,
  textureLoader,
} from 'utils/three';
import { ModelAnimationType } from './deviceModels';

const MeshType = {
  Frame: 'Frame',
  Logo: 'Logo',
  Screen: 'Screen',
};

const rotationSpringConfig = {
  stiffness: 40,
  damping: 20,
  mass: 1.4,
  restSpeed: 0.001,
};

export interface ModelTexture {
  srcSet: string | { src: string; width: number }[];
  sizes: string;
  placeholder: {
    src: string;
  };
}

export interface ModelConfig {
  url: string;
  width: number;
  height: number;
  position: { x: number; y: number; z: number };
  animation: string;
  texture: ModelTexture;
}

interface ModelProps {
  models: ModelConfig[];
  show?: boolean;
  showDelay?: number;
  cameraPosition?: { x: number; y: number; z: number };
  style?: CSSProperties;
  className?: string;
  alt?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export const Model = ({
  models,
  show = true,
  showDelay = 0,
  cameraPosition = { x: 0, y: 0, z: 8 },
  style,
  className,
  alt,
  ...rest
}: ModelProps) => {
  const [loaded, setLoaded] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const camera = useRef<PerspectiveCamera>(null);
  const modelGroup = useRef<Group>(null);
  const scene = useRef<Scene>(null);
  const renderer = useRef<WebGLRenderer>(null);
  const shadowGroup = useRef<Group>(null);
  const renderTarget = useRef<WebGLRenderTarget>(null);
  const renderTargetBlur = useRef<WebGLRenderTarget>(null);
  const shadowCamera = useRef<OrthographicCamera>(null);
  const depthMaterial = useRef<MeshDepthMaterial>(null);
  const horizontalBlurMaterial = useRef<ShaderMaterial>(null);
  const verticalBlurMaterial = useRef<ShaderMaterial>(null);
  const plane = useRef<Mesh>(null);
  const lights = useRef<Light[]>([]);
  const blurPlane = useRef<Mesh>(null);
  const fillPlane = useRef<Mesh>(null);
  const isInViewport = useInViewport(container, false, { threshold: 0.2 });
  const reduceMotion = useReducedMotion();
  const rotationX = useSpring(0, rotationSpringConfig);
  const rotationY = useSpring(0, rotationSpringConfig);

  const [disableWebGL, setDisableWebGL] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent || '';
    const isBot =
      /Googlebot|Bingbot|Slurp|DuckDuckBot|Baiduspider|YandexBot|Sogou|Exabot|facebot|ia_archiver/i.test(
        userAgent
      );

    if (isBot) {
      setDisableWebGL(false);
    }
  }, []);

  useEffect(() => {
    if (disableWebGL) {
      console.error('WebGL is disabled');
      return;
    }

    if (!container.current || !canvas.current) return;

    const { clientWidth, clientHeight } = container.current;

    try {
      const _renderer = new WebGLRenderer({
        canvas: canvas.current,
        alpha: true,
        antialias: false,
        powerPreference: 'default',
        failIfMajorPerformanceCaveat: false,
      });
      (renderer as MutableRefObject<WebGLRenderer>).current = _renderer;
    } catch (error) {
      console.error(error);
      return;
    }

    const _renderer = renderer.current;
    if (!_renderer) return;

    _renderer.setPixelRatio(2);
    _renderer.setSize(clientWidth, clientHeight);
    _renderer.outputColorSpace = SRGBColorSpace;

    const _camera = new PerspectiveCamera(36, clientWidth / clientHeight, 0.1, 100);
    _camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    (camera as MutableRefObject<PerspectiveCamera>).current = _camera;

    const _scene = new Scene();
    (scene as MutableRefObject<Scene>).current = _scene;

    const _modelGroup = new Group();
    (modelGroup as MutableRefObject<Group>).current = _modelGroup;
    _scene.add(_modelGroup);

    // Lighting
    const ambientLight = new AmbientLight(0xffffeb, 0.5);
    const keyLight = new DirectionalLight(0xffffff, 1.3);
    const fillLight = new DirectionalLight(0xffd6aa, 0.7);
    const backLight = new DirectionalLight(0xe6f0ff, 0.4);

    const underLight = new DirectionalLight(0xffffff, 0.3);
    underLight.position.set(0, -2, 0);
    underLight.target.position.set(0, 0, 0);
    _scene.add(underLight);
    _scene.add(underLight.target);

    fillLight.position.set(-6, 2, 2);
    keyLight.position.set(0.5, 0, 0.866);
    backLight.position.set(-1, 2, -2);

    const _lights = [ambientLight, keyLight, fillLight, backLight];
    (lights as MutableRefObject<Light[]>).current = _lights;
    _lights.forEach(light => _scene.add(light));

    // The shadow container
    const _shadowGroup = new Group();
    (shadowGroup as MutableRefObject<Group>).current = _shadowGroup;
    _scene.add(_shadowGroup);
    _shadowGroup.position.set(0, 0, -0.8);
    _shadowGroup.rotateX(Math.PI / 2);

    const renderTargetSize = 512;
    const planeWidth = 8;
    const planeHeight = 8;
    const cameraHeight = 1.5;
    const shadowOpacity = 0.8;
    const shadowDarkness = 3;

    // The render target that will show the shadows in the plane texture
    const _renderTarget = new WebGLRenderTarget(renderTargetSize, renderTargetSize);
    (renderTarget as MutableRefObject<WebGLRenderTarget>).current = _renderTarget;
    _renderTarget.texture.generateMipmaps = false;

    // The render target that we will use to blur the first render target
    const _renderTargetBlur = new WebGLRenderTarget(renderTargetSize, renderTargetSize);
    (renderTargetBlur as MutableRefObject<WebGLRenderTarget>).current = _renderTargetBlur;
    _renderTargetBlur.texture.generateMipmaps = false;

    // Make a plane and make it face up
    const planeGeometry = new PlaneGeometry(planeWidth, planeHeight).rotateX(Math.PI / 2);

    const planeMaterial = new MeshBasicMaterial({
      map: _renderTarget.texture,
      opacity: shadowOpacity,
      transparent: true,
    });

    const _plane = new Mesh(planeGeometry, planeMaterial);
    (plane as MutableRefObject<Mesh>).current = _plane;
    // The y from the texture is flipped!
    _plane.scale.y = -1;
    _shadowGroup.add(_plane);

    // The plane onto which to blur the texture
    const _blurPlane = new Mesh(planeGeometry);
    (blurPlane as MutableRefObject<Mesh>).current = _blurPlane;
    _blurPlane.visible = false;
    _shadowGroup.add(_blurPlane);

    // The plane with the color of the ground
    const fillMaterial = new MeshBasicMaterial({
      color: 0xffffff,
      opacity: 0,
      transparent: true,
    });

    const _fillPlane = new Mesh(planeGeometry, fillMaterial);
    (fillPlane as MutableRefObject<Mesh>).current = _fillPlane;
    _fillPlane.rotateX(Math.PI);
    _fillPlane.position.y -= 0.00001;
    _shadowGroup.add(_fillPlane);

    // The camera to render the depth material from
    const _shadowCamera = new OrthographicCamera(
      -planeWidth / 2,
      planeWidth / 2,
      planeHeight / 2,
      -planeHeight / 2,
      0,
      cameraHeight
    );
    (shadowCamera as MutableRefObject<OrthographicCamera>).current = _shadowCamera;
    // Get the camera to look up
    _shadowCamera.rotation.x = Math.PI / 2;
    _shadowGroup.add(_shadowCamera);

    // Like MeshDepthMaterial, but goes from black to transparent
    const _depthMaterial = new MeshDepthMaterial();
    (depthMaterial as MutableRefObject<MeshDepthMaterial>).current = _depthMaterial;
    _depthMaterial.userData = { darkness: { value: shadowDarkness } };
    _depthMaterial.onBeforeCompile = shader => {
      shader.uniforms.darkness = _depthMaterial.userData.darkness;
      shader.fragmentShader = `
        uniform float darkness;
        ${shader.fragmentShader.replace(
          'gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );',
          'gl_FragColor = vec4( vec3( 0.0 ), ( 1.0 - fragCoordZ ) * darkness );'
        )}
      `;
    };
    _depthMaterial.depthTest = false;
    _depthMaterial.depthWrite = false;

    const _horizontalBlurMaterial = new ShaderMaterial(HorizontalBlurShader);
    (horizontalBlurMaterial as MutableRefObject<ShaderMaterial>).current =
      _horizontalBlurMaterial;
    _horizontalBlurMaterial.depthTest = false;

    const _verticalBlurMaterial = new ShaderMaterial(VerticalBlurShader);
    (verticalBlurMaterial as MutableRefObject<ShaderMaterial>).current =
      _verticalBlurMaterial;
    _verticalBlurMaterial.depthTest = false;

    const unsubscribeX = rotationX.on('change', renderFrame);
    const unsubscribeY = rotationY.on('change', renderFrame);

    const currentRenderTarget = renderTarget.current;
    const currentRenderTargetBlur = renderTargetBlur.current;
    const currentLights = lights.current;
    const currentScene = scene.current;
    const currentRenderer = renderer.current;

    return () => {
      currentRenderTarget?.dispose();
      currentRenderTargetBlur?.dispose();
      if (currentLights) removeLights(currentLights);
      if (currentScene) cleanScene(currentScene);
      if (currentRenderer) cleanRenderer(currentRenderer);
      unsubscribeX();
      unsubscribeY();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const blurShadow = useCallback((amount: number) => {
    if (
      !blurPlane.current ||
      !horizontalBlurMaterial.current ||
      !renderTarget.current ||
      !renderer.current ||
      !renderTargetBlur.current ||
      !shadowCamera.current ||
      !verticalBlurMaterial.current
    )
      return;

    blurPlane.current.visible = true;

    // Blur horizontally and draw in the renderTargetBlur
    blurPlane.current.material = horizontalBlurMaterial.current;
    horizontalBlurMaterial.current.uniforms.tDiffuse.value = renderTarget.current.texture;
    horizontalBlurMaterial.current.uniforms.h.value = amount * (1 / 256);

    renderer.current.setRenderTarget(renderTargetBlur.current);
    try {
      renderer.current.render(blurPlane.current, shadowCamera.current);
    } catch (e) {
      console.error(e);
      return;
    }

    // Blur vertically and draw in the main renderTarget
    blurPlane.current.material = verticalBlurMaterial.current;
    verticalBlurMaterial.current.uniforms.tDiffuse.value =
      renderTargetBlur.current.texture;
    verticalBlurMaterial.current.uniforms.v.value = amount * (1 / 256);

    renderer.current.setRenderTarget(renderTarget.current);
    try {
      renderer.current.render(blurPlane.current, shadowCamera.current);
    } catch (e) {
      console.error(e);
      return;
    }

    blurPlane.current.visible = false;
  }, []);

  // Handle render passes for a single frame
  const renderFrame = useCallback(() => {
    if (
      !scene.current ||
      !renderer.current ||
      !shadowCamera.current ||
      !depthMaterial.current ||
      !renderTarget.current ||
      !modelGroup.current ||
      !camera.current
    )
      return;

    const blurAmount = 5;

    // Remove the background
    const initialBackground = scene.current.background;
    scene.current.background = null;

    // Force the depthMaterial to everything
    scene.current.overrideMaterial = depthMaterial.current;

    // Render to the render target to get the depths
    renderer.current.setRenderTarget(renderTarget.current);
    try {
      renderer.current.render(scene.current, shadowCamera.current);
    } catch (e) {
      console.error(e);
      return;
    }

    // And reset the override material
    scene.current.overrideMaterial = null;

    blurShadow(blurAmount);

    // A second pass to reduce the artifacts
    blurShadow(blurAmount * 0.4);

    // Reset and render the normal scene
    renderer.current.setRenderTarget(null);
    scene.current.background = initialBackground;

    modelGroup.current.rotation.x = rotationX.get();
    modelGroup.current.rotation.y = rotationY.get();

    try {
      renderer.current.render(scene.current, camera.current);
    } catch (e) {
      console.error(e);
      return;
    }
  }, [blurShadow, rotationX, rotationY]);

  // Handle mouse move animation
  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      const { innerWidth, innerHeight } = window;

      const position = {
        x: (event.clientX - innerWidth / 2) / innerWidth,
        y: (event.clientY - innerHeight / 2) / innerHeight,
      };

      rotationY.set(position.x / 2);
      rotationX.set(position.y / 2);
    };

    if (isInViewport && !reduceMotion) {
      window.addEventListener('mousemove', onMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [isInViewport, reduceMotion, rotationX, rotationY]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!container.current || !renderer.current || !camera.current) return;

      const { clientWidth, clientHeight } = container.current;

      renderer.current.setSize(clientWidth, clientHeight);
      camera.current.aspect = clientWidth / clientHeight;
      camera.current.updateProjectionMatrix();

      renderFrame();
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [renderFrame]);

  return (
    <div
      className={classes(
        'relative opacity-0',
        loaded && 'animate-[fadeIn_1s_ease_forwards_var(--delay)]',
        className
      )}
      data-loaded={loaded}
      style={cssProps({ delay: numToMs(showDelay) }, style)}
      ref={container}
      role="img"
      aria-label={alt}
      {...rest}
    >
      <canvas className="absolute inset-0" ref={canvas} />
      {models.map((model, index) => (
        <Device
          key={JSON.stringify(model.position)}
          renderer={renderer}
          modelGroup={modelGroup}
          show={show}
          showDelay={showDelay}
          renderFrame={renderFrame}
          index={index}
          setLoaded={setLoaded}
          model={model}
        />
      ))}
    </div>
  );
};

interface DeviceProps {
  renderer: MutableRefObject<WebGLRenderer | null>;
  model: ModelConfig;
  modelGroup: MutableRefObject<Group | null>;
  renderFrame: () => void;
  index: number;
  showDelay: number;
  setLoaded: (_loaded: boolean) => void;
  show: boolean;
}

const Device = ({
  renderer,
  model,
  modelGroup,
  renderFrame,
  index,
  showDelay,
  setLoaded,
  show,
}: DeviceProps) => {
  const [loadDevice, setLoadDevice] = useState<{
    start: () => Promise<{
      loadFullResTexture: () => Promise<void>;
      playAnimation: () => { stop: () => void } | undefined;
    }>;
  }>();
  const reduceMotion = useReducedMotion();
  const placeholderScreen = useRef<Object3D | null>(null);

  useEffect(() => {
    const applyScreenTexture = async (texture: Texture, node: Mesh) => {
      texture.colorSpace = SRGBColorSpace;
      texture.flipY = false;

      if (renderer.current?.capabilities?.getMaxAnisotropy) {
        texture.anisotropy = renderer.current.capabilities.getMaxAnisotropy();
      }

      texture.generateMipmaps = false;
      texture.needsUpdate = true;

      await new Promise<void>(resolve => {
        if (texture.image) {
          resolve();
        } else {
          const timeout = setInterval(() => {
            if (texture.image) {
              clearInterval(timeout);
              resolve();
            }
          }, 10);
        }
      });

      if (node.material) {
        if (Array.isArray(node.material)) {
          node.material.forEach(m => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (m as MeshBasicMaterial).color = new Color(0xffffff) as any;
            m.transparent = true;
            (m as MeshBasicMaterial).map = texture;
            m.needsUpdate = true;
          });
        } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (node.material as MeshBasicMaterial).color = new Color(0xffffff) as any;
          node.material.transparent = true;
          (node.material as MeshBasicMaterial).map = texture;
          node.material.needsUpdate = true;
        }
      }
    };

    const load = async () => {
      const { texture, position, url } = model;
      let loadFullResTexture: () => Promise<void> = async () => {};
      let playAnimation: () => { stop: () => void } | undefined = () => undefined;

      const [placeholder, gltf] = await Promise.all([
        await textureLoader.loadAsync(texture.placeholder.src),
        await modelLoader.loadAsync(url),
      ]);

      gltf.scene.visible = false;
      const modelScene = gltf.scene;

      gltf.scene.traverse(async (node: Object3D) => {
        const mesh = node as Mesh;
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m: Material) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (m as MeshBasicMaterial).color = new Color(0x1f2025) as any;
              (m as MeshBasicMaterial).color.convertSRGBToLinear();
            });
          } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (mesh.material as MeshBasicMaterial).color = new Color(0x1f2025) as any;
            (mesh.material as MeshBasicMaterial).color.convertSRGBToLinear();
          }
        }

        if (node.name === MeshType.Screen) {
          placeholderScreen.current = node.clone();
          if (placeholderScreen.current) {
            const screenMesh = placeholderScreen.current as Mesh;
            const originalMesh = node as Mesh;

            if (originalMesh.material) {
              if (Array.isArray(originalMesh.material)) {
                screenMesh.material = originalMesh.material.map(m => m.clone());
              } else {
                screenMesh.material = originalMesh.material.clone();
              }
            }

            node.parent?.add(placeholderScreen.current);
            if (screenMesh.material) {
              if (Array.isArray(screenMesh.material)) {
                screenMesh.material.forEach(m => (m.opacity = 1));
              } else {
                screenMesh.material.opacity = 1;
              }
            }

            placeholderScreen.current.position.z += 0.001;

            applyScreenTexture(placeholder, placeholderScreen.current as Mesh);
          }

          loadFullResTexture = async () => {
            const image = await resolveSrcFromSrcSet(texture);
            const fullSize = await textureLoader.loadAsync(image);
            await applyScreenTexture(fullSize, node as Mesh);

            animate(1, 0, {
              onUpdate: value => {
                const pScreen = placeholderScreen.current as Mesh;
                if (pScreen && pScreen.material) {
                  if (Array.isArray(pScreen.material)) {
                    pScreen.material.forEach(m => (m.opacity = value));
                  } else {
                    pScreen.material.opacity = value;
                  }
                  renderFrame();
                }
              },
            });
          };
        }
      });

      const targetPosition = new Vector3(position.x, position.y, position.z);

      if (reduceMotion) {
        gltf.scene.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
      }

      if (model.animation === ModelAnimationType.SpringUp) {
        playAnimation = () => {
          if (!show || !modelGroup.current) return;
          const startPosition = new Vector3(
            targetPosition.x,
            targetPosition.y - 1,
            targetPosition.z
          );

          gltf.scene.position.set(startPosition.x, startPosition.y, startPosition.z);

          modelGroup.current.clear();
          modelGroup.current.add(modelScene);
          modelScene.visible = show;

          return animate(startPosition.y, targetPosition.y, {
            type: 'spring',
            delay: (100 * index + showDelay) / 1000,
            stiffness: 60,
            damping: 20,
            mass: 1,
            restSpeed: 0.0001,
            restDelta: 0.0001,
            onUpdate: value => {
              gltf.scene.position.y = value;
              renderFrame();
            },
          });
        };
      }

      if (model.animation === ModelAnimationType.LaptopOpen) {
        playAnimation = () => {
          if (!modelGroup.current) return;
          const frameNode = gltf.scene.children.find(
            node => node.name === MeshType.Frame
          );
          if (!frameNode) return;

          const startRotation = new Vector3(MathUtils.degToRad(90), 0, 0);
          const endRotation = new Vector3(0, 0, 0);

          gltf.scene.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
          frameNode.rotation.set(startRotation.x, startRotation.y, startRotation.z);

          modelGroup.current.clear();
          modelGroup.current.add(modelScene);
          modelScene.visible = true;

          return animate(startRotation.x, endRotation.x, {
            type: 'spring',
            delay: (100 * index + showDelay + 300) / 1000,
            stiffness: 80,
            damping: 20,
            restSpeed: 0.0001,
            restDelta: 0.0001,
            onUpdate: value => {
              frameNode.rotation.x = value;
              renderFrame();
            },
          });
        };
      }

      return { loadFullResTexture, playAnimation };
    };

    setLoadDevice({ start: load });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let animation: { stop: () => void } | undefined;

    const onLoad = async () => {
      if (!loadDevice) return;
      const { loadFullResTexture, playAnimation } = await loadDevice.start();

      setLoaded(true);

      if (!reduceMotion) {
        animation = playAnimation();
      }

      await loadFullResTexture();

      if (reduceMotion) {
        renderFrame();
      }
    };

    startTransition(() => {
      onLoad();
    });

    return () => {
      animation?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadDevice, show]);

  return null;
};
