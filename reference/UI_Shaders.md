# UI Shaders — GLSL examples for 3D modeling program

This document collects compact, production-ready GLSL shader examples commonly useful inside a 3D modeling application's UI. Each entry includes a brief description, uniforms, attributes/varyings, and a minimal vertex+fragment shader pair suitable for an OpenGL-style pipeline. Adapt to your engine's bindings and attribute names as needed.

---

## 1) Flat / Unlit (vertex-colored)

Simple unlit shader that uses a per-vertex color. Good for icons, gizmo geometry, or fast overlays.

**Uniforms**: none (except standard matrices)

```glsl
// Vertex
#version 330 core
layout(location=0) in vec3 aPos;
layout(location=1) in vec4 aColor;
uniform mat4 u_ModelViewProj;
out vec4 vColor;
void main(){ vColor = aColor; gl_Position = u_ModelViewProj * vec4(aPos,1.0); }

// Fragment
#version 330 core
in vec4 vColor;
out vec4 FragColor;
void main(){ FragColor = vColor; }
```

---

## 2) Unlit Textured with Tint

For UI thumbnails or material previews where a base texture is tinted by UI state.

**Uniforms**: `sampler2D u_Texture; vec4 u_Tint; float u_Alpha;`

```glsl
// Vertex
#version 330 core
layout(location=0) in vec3 aPos;
layout(location=2) in vec2 aUV;
uniform mat4 u_MVP;
out vec2 vUV;
void main(){ vUV = aUV; gl_Position = u_MVP*vec4(aPos,1.0); }

// Fragment
#version 330 core
in vec2 vUV; uniform sampler2D u_Texture; uniform vec4 u_Tint; uniform float u_Alpha;
out vec4 FragColor;
void main(){ vec4 c = texture(u_Texture, vUV) * u_Tint; c.a *= u_Alpha; FragColor = c; }
```

---

## 3) Lambert (diffuse) — simple lit UI objects

Good for lit icons, manipulators with soft shading.

**Uniforms**: `vec3 u_LightDir; vec3 u_LightColor; vec3 u_BaseColor; mat4 u_MV; mat4 u_MVP;`

```glsl
// Vertex
#version 330 core
layout(location=0) in vec3 aPos; layout(location=3) in vec3 aNormal;
uniform mat4 u_MV; uniform mat4 u_MVP;
out vec3 vNormalEye;
void main(){ vec4 posEye = u_MV * vec4(aPos,1.0); vNormalEye = mat3(u_MV) * aNormal; gl_Position = u_MVP*vec4(aPos,1.0); }

// Fragment
#version 330 core
in vec3 vNormalEye; uniform vec3 u_LightDir; uniform vec3 u_LightColor; uniform vec3 u_BaseColor; out vec4 FragColor;
void main(){ vec3 N = normalize(vNormalEye); float NdotL = max(dot(N, normalize(u_LightDir)), 0.0); vec3 col = u_BaseColor * u_LightColor * NdotL; FragColor = vec4(col, 1.0); }
```

---

## 4) Blinn-Phong (specular highlight)

Classic specular highlight useful for feel of polished manipulators.

**Uniforms**: `vec3 u_LightDir, u_CamPos, u_LightColor, u_BaseColor; float u_Shininess;`

```glsl
// Vertex
#version 330 core
layout(location=0) in vec3 aPos; layout(location=3) in vec3 aNormal;
uniform mat4 u_Model; uniform mat4 u_MV; uniform mat4 u_MVP;
out vec3 vPosWorld; out vec3 vNormal;
void main(){ vec4 posWorld = u_Model * vec4(aPos,1.0); vPosWorld = posWorld.xyz; vNormal = mat3(u_Model) * aNormal; gl_Position = u_MVP * vec4(aPos,1.0); }

// Fragment
#version 330 core
in vec3 vPosWorld; in vec3 vNormal;
uniform vec3 u_LightDir; uniform vec3 u_LightColor; uniform vec3 u_CamPos; uniform vec3 u_BaseColor; uniform float u_Shininess;
out vec4 FragColor;
void main(){ vec3 N = normalize(vNormal); vec3 L = normalize(-u_LightDir); vec3 V = normalize(u_CamPos - vPosWorld); vec3 H = normalize(L + V);
 float diff = max(dot(N,L), 0.0);
 float spec = (diff>0.0) ? pow(max(dot(N,H), 0.0), u_Shininess) : 0.0;
 vec3 col = u_BaseColor * diff * u_LightColor + u_LightColor * spec;
 FragColor = vec4(col, 1.0);
}
```

---

## 5) Simple PBR (metallic-roughness) — compact

A compact approximation of a metallic/roughness PBR for material preview thumbnails.

**Uniforms**: `vec3 u_BaseColor; float u_Metallic; float u_Roughness; vec3 u_LightDir; vec3 u_CamPos;` (IBL omitted for brevity)

```glsl
// Vertex: provide world pos and normal similar to previous examples
#version 330 core
layout(location=0) in vec3 aPos; layout(location=3) in vec3 aNormal; uniform mat4 u_Model; uniform mat4 u_MVP; out vec3 vPos; out vec3 vN;
void main(){ vPos = (u_Model * vec4(aPos,1.0)).xyz; vN = mat3(u_Model) * aNormal; gl_Position = u_MVP * vec4(aPos,1.0); }

// Fragment
#version 330 core
in vec3 vPos; in vec3 vN; out vec4 FragColor;
uniform vec3 u_BaseColor; uniform float u_Metallic; uniform float u_Roughness; uniform vec3 u_LightDir; uniform vec3 u_CamPos; uniform vec3 u_LightColor;

// Schlick Fresnel and GGX NDF funcs (simplified)
float DistributionGGX(float NdotH, float rough) {
    float a = rough*rough; float a2 = a*a; float denom = (NdotH*NdotH)*(a2-1.0)+1.0; return a2 / (3.14159265 * denom * denom);
}
float GeometrySchlickGGX(float NdotV, float rough){ float r = (rough+1.0); float k = (r*r)/8.0; return NdotV / (NdotV*(1.0 - k) + k); }
vec3 fresnelSchlick(float cosTheta, vec3 F0){ return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0); }

void main(){ vec3 N = normalize(vN); vec3 V = normalize(u_CamPos - vPos); vec3 L = normalize(-u_LightDir); vec3 H = normalize(V + L);
 float NdotV = max(dot(N,V), 0.001); float NdotL = max(dot(N,L), 0.0); float NdotH = max(dot(N,H), 0.0);
 vec3 F0 = mix(vec3(0.04), u_BaseColor, u_Metallic);
 float D = DistributionGGX(NdotH, u_Roughness);
 float G = GeometrySchlickGGX(NdotV, u_Roughness) * GeometrySchlickGGX(NdotL, u_Roughness);
 vec3 F = fresnelSchlick(max(dot(H,V),0.0), F0);
 vec3 nominator = D * G * F; float denom = 4.0 * NdotV * NdotL + 0.001; vec3 spec = nominator / denom;
 vec3 kD = (1.0 - F) * (1.0 - u_Metallic);
 vec3 color = (kD * u_BaseColor / 3.14159265 + spec) * u_LightColor * NdotL;
 FragColor = vec4(color, 1.0);
}
```

Notes: add environment map (IBL) for final-quality previews.

---

## 6) MatCap (material capture)

Useful for fast material previews using a 2D matcap texture.

**Uniforms**: `sampler2D u_MatCap; mat4 u_MV; mat4 u_MVP;`

```glsl
// Vertex
#version 330 core
layout(location=0) in vec3 aPos; layout(location=3) in vec3 aNormal; uniform mat4 u_MV; uniform mat4 u_MVP; out vec3 vNormalEye; void main(){ vec4 posEye = u_MV*vec4(aPos,1.0); vNormalEye = mat3(u_MV)*aNormal; gl_Position = u_MVP*vec4(aPos,1.0); }

// Fragment
#version 330 core
in vec3 vNormalEye; uniform sampler2D u_MatCap; out vec4 FragColor;
void main(){ vec3 N = normalize(vNormalEye);
 vec2 uv = N.xy * 0.5 + 0.5; // map XY to 0..1
 vec4 mat = texture(u_MatCap, uv);
 FragColor = mat;
}
```

---

## 7) Rim / Fresnel highlight (stylized)

Adds a rim highlight useful for selection emphasis or stylized materials.

**Uniforms**: `vec3 u_CamPos; vec3 u_RimColor; float u_RimPower; float u_RimIntensity;`

```glsl
// Vertex: provide world pos and normal
#version 330 core
layout(location=0) in vec3 aPos; layout(location=3) in vec3 aNormal; uniform mat4 u_Model; uniform mat4 u_MVP; out vec3 vPos; out vec3 vN; void main(){ vPos = (u_Model*vec4(aPos,1.0)).xyz; vN = mat3(u_Model)*aNormal; gl_Position = u_MVP*vec4(aPos,1.0); }

// Fragment
#version 330 core
in vec3 vPos; in vec3 vN; uniform vec3 u_CamPos; uniform vec3 u_RimColor; uniform float u_RimPower; uniform float u_RimIntensity; out vec4 FragColor;
void main(){ vec3 V = normalize(u_CamPos - vPos); float rim = pow(1.0 - max(dot(normalize(vN), V), 0.0), u_RimPower) * u_RimIntensity; FragColor = vec4(u_RimColor * rim, rim); }
```

Use additive blending to overlay the rim on base shading.

---

## 8) Toon / Cel Shading (2-band)

Stylized shading with two bands for quick material previews or selection modes.

**Uniforms**: `vec3 u_LightDir; vec3 u_Color;`

```glsl
#version 330 core
// Vertex: same as Lambert
layout(location=0) in vec3 aPos; layout(location=3) in vec3 aNormal; uniform mat4 u_MV; uniform mat4 u_MVP; out float vNdL; void main(){ vec3 N = normalize(mat3(u_MV)*aNormal); vNdL = dot(N, normalize(mat3(u_MV)*(-u_LightDir))); gl_Position = u_MVP*vec4(aPos,1.0); }

// Fragment
#version 330 core
in float vNdL; uniform vec3 u_Color; out vec4 FragColor;
void main(){ float b = vNdL; float shade = (b>0.5) ? 1.0 : 0.4; FragColor = vec4(u_Color * shade, 1.0); }
```

---

## 9) Outline (edge detection via normal/depth in a second pass)

Post-process approach: render normal+depth to an offscreen target, then a fullscreen quad compares neighbors to produce outlines. Minimal fragment for the quad follows.

**G-buffers**: `sampler2D tNormalDepth` (RGBA: normal.xyz, depth)

```glsl
#version 330 core
in vec2 vUV; uniform sampler2D u_NormDepth; uniform vec2 u_Texel; uniform float u_Threshold; out vec4 FragColor;
void main(){ vec3 nC = texture(u_NormDepth, vUV).xyz; float dC = texture(u_NormDepth, vUV).a;
 float edge=0.0;
 for(int x=-1;x<=1;x++) for(int y=-1;y<=1;y++){ vec2 off = vUV + vec2(x,y)*u_Texel; vec3 n = texture(u_NormDepth, off).xyz; float d = texture(u_NormDepth, off).a; if(length(n - nC) > u_Threshold || abs(d - dC) > u_Threshold) edge = 1.0; }
 FragColor = vec4(vec3(edge), 1.0);
}
```

---

## 10) UV/Grid Checker — diagnostic overlay for UV-editing viewport

Generate a checker or grid procedurally in UV-space for quick alignment feedback.

**Uniforms**: `vec3 u_ColorA, u_ColorB; float u_Scale; bool u_UseGrid;`

```glsl
// Vertex passes UV
#version 330 core
layout(location=0) in vec2 aUV; out vec2 vUV; void main(){ vUV = aUV; gl_Position = vec4( /* quad positions or passthrough */ 0.0 ); }

// Fragment
#version 330 core
in vec2 vUV; uniform vec3 u_A; uniform vec3 u_B; uniform float u_Scale; out vec4 FragColor;
void main(){ vec2 s = vUV * u_Scale; vec2 ip = floor(s); float checker = mod(ip.x + ip.y, 2.0); vec3 c = mix(u_A, u_B, checker); FragColor = vec4(c,1.0); }
```

---

## 11) Normal visualization (debug)

Visualize normals directly as RGB to debug orientation problems.

```glsl
// Fragment (after vertex provides normal in world or view space)
#version 330 core
in vec3 vN; out vec4 FragColor;
void main(){ vec3 n = normalize(vN) * 0.5 + 0.5; FragColor = vec4(n,1.0); }
```

---

## 12) Depth visualization

Map linear depth to a grayscale useful for diagnosing near/far clipping and camera placement.

**Uniforms**: `float u_Near, u_Far;`

```glsl
in float vDepth; out vec4 FragColor;
float LinearizeDepth(float z){ return (2.0*u_Near) / (u_Far + u_Near - z*(u_Far - u_Near)); }
void main(){ float d = LinearizeDepth(vDepth); FragColor = vec4(vec3(d), 1.0); }
```

---

## 13) Selection highlight (pulsing overlay)

Overlay used when an object is selected. Uses time to pulse alpha.

**Uniforms**: `float u_Time; vec4 u_SelectColor; float u_PulseSpeed;`

```glsl
in vec2 vUV; out vec4 FragColor; uniform float u_Time; uniform vec4 u_SelectColor; uniform float u_PulseSpeed;
void main(){ float a = 0.5 + 0.5*sin(u_Time * u_PulseSpeed); FragColor = vec4(u_SelectColor.rgb, u_SelectColor.a * a); }
```

Blend additive or alpha depending on style.

---

## 14) Hover / Ghost (transparent overlay with border)

A two-pass approach: base translucent fill, then a thin hard border using derivative or barycentric coordinates. Example uses barycentric approach (requires extra attribute).

**Vertex**: pass barycentric coords per vertex

```glsl
// Fragment
#version 330 core
in vec3 vBary; uniform vec4 u_Fill; uniform vec4 u_Border; uniform float u_Thickness; out vec4 FragColor;
float edgeFactor(){ vec3 d = fwidth(vBary); vec3 a3 = smoothstep(vec3(0.0), d * u_Thickness, vBary); return min(min(a3.x, a3.y), a3.z); }
void main(){ float e = edgeFactor(); vec4 fill = u_Fill; vec4 border = u_Border;
 FragColor = mix(border, fill, e);
}
```

---

## Integration notes

* Replace `#version` and attribute locations to suit WebGL/Metal/Direct3D as required. For HLSL, porting is straightforward: `in`/`out` to `VS_INPUT`/`VS_OUTPUT` semantics, `texture()` to `Texture.Sample()` etc.
* Keep UI shaders small and fast: avoid branching and high-cost loops; keep multiple LODs for mobile or low-power devices.
* For post-process outlines and effects, render required G-buffers (normals, depth, ID) at the same resolution as viewport or at a lower resolution for performance.
* Consider exposing toggles in the UI for `MatCap`, `Metallic` previews, and `Gamma`/`SRGB` handling.

---

If you want, I can also:

* Produce HLSL and GLSL ES (WebGL) equivalents.
* Provide a small shader library file (single header) arranged for your engine's naming conventions.
* Create compact versions with minimal dependencies for immediate embedding into an editor.

Specify which follow-up you want and target API (OpenGL, WebGL, Direct3D, Metal).

---

Here are several commonly used shaders for 3D modeling program UIs, written in GLSL-like syntax:

## 1. Flat Unlit Shader
**Use case:** Basic UI elements, gizmos, icons
```glsl
// Vertex
#version 330 core
layout(location = 0) in vec3 aPos;
uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

void main() {
    gl_Position = projection * view * model * vec4(aPos, 1.0);
}

// Fragment
#version 330 core
uniform vec4 color;
out vec4 FragColor;

void main() {
    FragColor = color;
}
```

## 2. Wireframe Shader
**Use case:** Edge display, mesh outlines
```glsl
// Vertex
#version 330 core
layout(location = 0) in vec3 aPos;
uniform mat4 mvp;

void main() {
    gl_Position = mvp * vec4(aPos, 1.0);
}

// Fragment
#version 330 core
uniform vec4 wireColor;
uniform vec4 backgroundColor;
uniform float lineWidth;
out vec4 FragColor;

void main() {
    // Distance from fragment to nearest edge
    vec3 d = fwidth(gl_FragCoord.xyz);
    vec3 a3 = smoothstep(vec3(0.0), d * lineWidth, gl_FragCoord.xyz);
    float edgeFactor = min(min(a3.x, a3.y), a3.z);

    FragColor = mix(wireColor, backgroundColor, edgeFactor);
}
```

## 3. X-Ray/See-Through Shader
**Use case:** Occluded object visualization
```glsl
// Fragment
#version 330 core
uniform vec4 frontColor;
uniform vec4 backColor;
uniform float opacity;
noperspective in vec3 dist;
out vec4 FragColor;

void main() {
    // Find smallest distance to edge
    float d = min(min(dist.x, dist.y), dist.z);

    // Anti-aliased wireframe
    float lineIntensity = smoothstep(0.0, 1.0, d);

    // Mix between solid and transparent
    vec4 color = mix(frontColor, backColor, lineIntensity);
    color.a *= opacity;

    FragColor = color;
}
```

## 4. Selection Highlight Shader
**Use case:** Selected objects, hover states
```glsl
// Fragment
#version 330 core
uniform vec4 baseColor;
uniform vec4 highlightColor;
uniform float time;  // For pulsing animation
uniform float intensity;
out vec4 FragColor;

void main() {
    // Pulsing effect
    float pulse = (sin(time * 5.0) + 1.0) * 0.5;
    vec4 color = mix(baseColor, highlightColor, intensity + pulse * 0.2);

    FragColor = color;
}
```

## 5. Grid Shader
**Use case:** Ground plane, construction grids
```glsl
// Fragment
#version 330 core
uniform vec2 gridSize;
uniform vec4 gridColor;
uniform vec4 majorGridColor;
uniform float opacity;
in vec3 worldPos;
out vec4 FragColor;

void main() {
    vec2 coord = worldPos.xz / gridSize;
    vec2 grid = abs(fract(coord - 0.5) - 0.5);
    vec2 dx = fwidth(coord);
    vec2 line = smoothstep(dx, vec2(0.0), grid);

    float majorLine = min(line.x, line.y);

    // Major grid lines every 10 units
    vec2 majorCoord = coord * 0.1;
    vec2 majorGrid = abs(fract(majorCoord - 0.5) - 0.5);
    vec2 majorLineVal = smoothstep(dx * 10.0, vec2(0.0), majorGrid);
    float major = min(majorLineVal.x, majorLineVal.y);

    vec4 finalColor = mix(gridColor, majorGridColor, major);
    finalColor.a *= opacity * (1.0 - majorLine);

    FragColor = finalColor;
}
```

## 6. Gizmo Shader
**Use case:** Transformation gizmos (move, rotate, scale)
```glsl
// Fragment - Axis-colored with highlight
#version 330 core
uniform int axis;  // 0=X, 1=Y, 2=Z, 3=selected
uniform float opacity;
out vec4 FragColor;

void main() {
    vec4 color;

    switch(axis) {
        case 0: color = vec4(1.0, 0.2, 0.2, opacity); break; // Red - X
        case 1: color = vec4(0.2, 1.0, 0.2, opacity); break; // Green - Y
        case 2: color = vec4(0.2, 0.4, 1.0, opacity); break; // Blue - Z
        case 3: color = vec4(1.0, 1.0, 0.0, opacity); break; // Yellow - Selected
    }

    FragColor = color;
}
```

## 7. UV Checkerboard Shader
**Use case:** Default material, UV visualization
```glsl
// Fragment
#version 330 core
uniform float scale;
in vec2 uv;
out vec4 FragColor;

void main() {
    vec2 scaledUV = uv * scale;
    vec2 grid = floor(scaledUV);
    float checker = mod(grid.x + grid.y, 2.0);

    vec3 color = mix(vec3(0.8), vec3(0.6), checker);
    FragColor = vec4(color, 1.0);
}
```

## 8. Normal Visualization Shader
**Use case:** Debugging, normal map preview
```glsl
// Fragment
#version 330 core
in vec3 normal;
out vec4 FragColor;

void main() {
    // Convert normal from [-1,1] to [0,1] for color display
    vec3 displayNormal = normalize(normal) * 0.5 + 0.5;
    FragColor = vec4(displayNormal, 1.0);
}
```

## 9. Screen-Space UI Shader
**Use case:** 2D UI elements, text, HUD
```glsl
// Vertex
#version 330 core
layout(location = 0) in vec2 aPos;
layout(location = 1) in vec2 aTexCoord;
out vec2 texCoord;

void main() {
    gl_Position = vec4(aPos, 0.0, 1.0);  // Already in clip space
    texCoord = aTexCoord;
}

// Fragment
#version 330 core
uniform sampler2D uiTexture;
uniform vec4 tintColor;
in vec2 texCoord;
out vec4 FragColor;

void main() {
    vec4 texColor = texture(uiTexture, texCoord);
    FragColor = texColor * tintColor;
}
```

## Common Utility Functions
```glsl
// Include in any shader that needs these utilities
float linearDepth(float depth, float near, float far) {
    return (2.0 * near) / (far + near - depth * (far - near));
}

vec3 hueToRGB(float hue) {
    vec3 rgb = fract(hue + vec3(0.0, 2.0/3.0, 1.0/3.0));
    rgb = abs(rgb * 6.0 - 3.0) - 1.0;
    return clamp(rgb, 0.0, 1.0);
}
```

These shaders cover the most common UI visualization needs in 3D modeling applications, from basic rendering to specialized visualization modes. They can be easily adapted and combined based on specific requirements.