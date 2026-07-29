/**
 * Shader for the hero orb.
 *
 * The vertex stage displaces an icosphere along its normals with two octaves of
 * simplex noise, and recomputes the normal from two neighbouring samples so the
 * lighting follows the deformation instead of the original sphere.
 * The fragment stage maps the brand gradient onto the surface and adds a
 * fresnel rim so the silhouette stays readable on any background.
 */

/** Ashima / Stefan Gustavson simplex noise, used verbatim. */
const SIMPLEX_3D = /* glsl */ `
vec3 mod289(vec3 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 permute(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

export const blobVertexShader = /* glsl */ `
uniform float uTime;
uniform float uAmplitude;
uniform float uFrequency;
uniform float uPointer;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vLocalPosition;
varying float vDisplacement;

${SIMPLEX_3D}

/**
 * Two octaves of noise, slowly drifting through the third dimension. The second
 * octave stays quiet on purpose: more of it turns the orb cloudy rather than
 * liquid.
 */
float fbm(vec3 p) {
  float value = snoise(p);
  value += 0.25 * snoise(p * 2.4 + 13.7);
  return value / 1.25;
}

float displacementAt(vec3 p) {
  // Careful: "sample" is a reserved word in GLSL, never name a variable that.
  vec3 noisePos = p * uFrequency + vec3(0.0, uTime * 0.18, uTime * 0.1);
  return fbm(noisePos) * uAmplitude;
}

/**
 * Rebuild the normal by displacing two points tangent to this one - cheaper and
 * steadier than computing derivatives in the fragment stage.
 */
vec3 recomputeNormal(vec3 pos, vec3 nor, float d) {
  vec3 tangent = normalize(cross(nor, vec3(0.0, 1.0, 0.0) + 0.001));
  vec3 bitangent = normalize(cross(nor, tangent));
  float eps = 0.035;

  vec3 a = normalize(pos + tangent * eps);
  vec3 b = normalize(pos + bitangent * eps);

  vec3 displacedCenter = pos + nor * d;
  vec3 displacedA = a + a * displacementAt(a);
  vec3 displacedB = b + b * displacementAt(b);

  return normalize(cross(displacedA - displacedCenter, displacedB - displacedCenter));
}

void main() {
  float d = displacementAt(position);
  vec3 displaced = position + normal * d;

  // A gentle pointer-driven swell keeps the orb feeling responsive.
  displaced += normal * uPointer * 0.06 * (0.5 + 0.5 * d);

  vec3 newNormal = recomputeNormal(position, normal, d);

  vDisplacement = d;
  vLocalPosition = displaced;
  vNormal = normalize(normalMatrix * newNormal);

  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
  vViewPosition = -mvPosition.xyz;

  gl_Position = projectionMatrix * mvPosition;
}
`;

export const blobFragmentShader = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform vec3 uRimColor;
uniform float uAmplitude;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vLocalPosition;
varying float vDisplacement;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vViewPosition);

  // The brand gradient runs at 223° - reproduce that sweep across the orb
  // (top-right → bottom-left), then let the relief perturb it so the colour
  // still follows the shape instead of looking painted on.
  float axis = clamp((vLocalPosition.x + vLocalPosition.y) * 0.62 + 0.5, 0.0, 1.0);
  float relief = clamp(vDisplacement / max(uAmplitude, 0.0001) * 0.5 + 0.5, 0.0, 1.0);
  float t = clamp(mix(1.0 - axis, relief, 0.3), 0.0, 1.0);

  vec3 color = mix(uColorA, uColorB, smoothstep(0.0, 0.5, t));
  color = mix(color, uColorC, smoothstep(0.48, 1.0, t));

  // Soft key light from the upper right.
  vec3 lightDir = normalize(vec3(0.6, 0.8, 0.9));
  float diffuse = 0.62 + 0.38 * max(dot(normal, lightDir), 0.0);
  color *= diffuse;

  // Specular sheen.
  vec3 halfDir = normalize(lightDir + viewDir);
  float specular = pow(max(dot(normal, halfDir), 0.0), 56.0);
  color += specular * 0.3;

  // Fresnel rim keeps the silhouette crisp in both themes.
  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
  color = mix(color, uRimColor, fresnel * 0.4);

  gl_FragColor = vec4(color, 1.0);
  #include <colorspace_fragment>
}
`;
