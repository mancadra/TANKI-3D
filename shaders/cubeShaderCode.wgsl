// Vertex shader
[[stage(vertex)]]
fn vs_main([[location(0)]] position: vec3<f32>) -> [[builtin(position)]] vec4<f32> {
    let scale = 0.5;
    return vec4<f32>(position * scale, 1.0);
}

// Fragment shader
[[stage(fragment)]]
fn fs_main() -> [[location(0)]] vec4<f32> {
    return vec4<f32>(1.0, 0.64, 0.0, 1.0); // Orange color
}