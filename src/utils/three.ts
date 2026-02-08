import type { Light, Material, Object3D, Scene, WebGLRenderer } from 'three';
import { Cache, TextureLoader } from 'three';
import { DRACOLoader, GLTFLoader } from 'three-stdlib';

// Enable caching for all loaders
Cache.enabled = true;

const dracoLoader = new DRACOLoader();
const gltfLoader = new GLTFLoader();
dracoLoader.setDecoderPath('/draco/');
gltfLoader.setDRACOLoader(dracoLoader);

/**
 * GLTF model loader configured with draco decoder
 */
export const modelLoader = gltfLoader;
export const textureLoader = new TextureLoader();

interface MeshObject extends Object3D {
  isMesh: boolean;
  geometry: { dispose: () => void };
  material: Material | Material[];
}

/**
 * Clean up a scene's materials and geometry
 */
export const cleanScene = (scene: Scene): void => {
  scene?.traverse((object: Object3D) => {
    const mesh = object as MeshObject;
    if (!mesh.isMesh) return;

    mesh.geometry.dispose();

    if ((mesh.material as Material).isMaterial) {
      cleanMaterial(mesh.material as Material);
    } else {
      for (const material of mesh.material as Material[]) {
        cleanMaterial(material);
      }
    }
  });
};

/**
 * Clean up and dispose of a material
 */
export const cleanMaterial = (material: Material): void => {
  material.dispose();

  for (const key of Object.keys(material)) {
    const value = (material as unknown as Record<string, unknown>)[key];
    if (value && typeof value === 'object' && 'minFilter' in (value as object)) {
      (value as { dispose: () => void }).dispose();

      // Close GLTF bitmap textures
      (value as { source?: { data?: { close?: () => void } } }).source?.data?.close?.();
    }
  }
};

/**
 * Clean up and dispose of a renderer
 */
export const cleanRenderer = (renderer: WebGLRenderer): void => {
  renderer.dispose();
};

/**
 * Clean up lights by removing them from their parent
 */
export const removeLights = (lights: Light[]): void => {
  for (const light of lights) {
    light.parent?.remove(light);
  }
};

/**
 * Get child by name
 */
export const getChild = (name: string, object: Object3D): Object3D | undefined => {
  let node: Object3D | undefined;

  object.traverse((child: Object3D) => {
    if (child.name === name) {
      node = child;
    }
  });

  return node;
};
