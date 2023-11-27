struct VertexInput {
    @location(0) position : vec3<f32>,
    @location(2) normal : vec3<f32>,
};

struct VertexOutput {
    @bui ltin(position) clipPosition : vec4<f32>,
    @location(0) v_position : vec3<f32>,
    @location(1) v_normal : vec3<f32>,
};

struct Uniforms {
    modelViewMatrix : mat4x4<f32>,
    projectionMatrix : mat4x4<f32>,
    normalMatrix : mat3x3<f32>,
};

@group(0) @binding(0) var<uniform> uniforms : Uniforms;

@vertex
fn vertex(input : VertexInput) -> VertexOutput {
    var output : VertexOutput;
    output.v_position = input.position;
    output.v_normal = normalize(uniforms.normalMatrix * input.normal);
    output.clipPosition = uniforms.projectionMatrix * uniforms.modelViewMatrix * vec4(input.position, 1.0);
    return output;
}


@group(1) @binding(0) var<uniform> fragUniforms : FragmentUniforms;

struct FragmentUniforms {
    u_resolution : vec2<f32>,
    u_mouse : vec2<f32>,
    u_time : f32,
    u_frame : f32,
};

struct FragmentInput {
    @location(0) v_position : vec3<f32>,
    @location(1) v_normal : vec3<f32>,
};

struct FragmentOutput {
    @location(0) color : vec4<f32>,
};

fn circle(pixel : vec2<f32>, center : vec2<f32>, radius : f32) -> f32 {
    return 1.0 - smoothstep(radius - 1.0, radius + 1.0, length(pixel - center));
}

fn rotate(angle : f32) -> mat2<f32> {
    return mat2<f32>(cos(angle), -sin(angle), sin(angle), cos(angle));
}

fn diffuseFactor(normal : vec3<f32>, light_direction : vec3<f32>) -> f32 {
    let df = dot(normalize(normal), normalize(light_direction));
    return max(0.0, df);
}

@fragment
fn fragment(input : FragmentInput) -> FragmentOutput {
    var output : FragmentOutput;

    let min_resolution = min(fragUniforms.u_resolution.x, fragUniforms.u_resolution.y);
    let light_direction = -vec3((fragUniforms.u_mouse - 0.5 * fragUniforms.u_resolution) / min_resolution, 0.5);

    let df = diffuseFactor(input.v_normal, light_direction);

    var pos = gl_FragCoord.xy - 0.5 * fragUniforms.u_resolution;
    pos = rotate(radians(20.0)) * pos;

    let grid_step : f32 = 12.0;
    let grid_pos = mod(pos, grid_step);

    var surface_color : f32 = 1.0;
    surface_color -= circle(grid_pos, vec2(grid_step / 2.0), 0.8 * grid_step * pow(1.0 - df, 2.0));
    surface_color = clamp(surface_color, 0.05, 1.0);

    output.color = vec4(vec3(surface_color), 1.0);

    return output;
}
