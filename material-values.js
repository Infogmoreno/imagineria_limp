AFRAME.registerComponent("material-values", {
  multiple: true,
  schema: {
    materialName: { type: "string", default: "" },
    color: { type: "color", default: "" },
    map: { type: "string", default: "" },
    metalness: { type: "number", default: -1, min: 0, max: 1 },
    roughness: { type: "number", default: -1, min: 0, max: 1 },
    opacity: { type: "number", default: 1, min: 0, max: 1 },
  },

  events: {
    "model-loaded": function () {
      this.update();
    },
  },

  init() {
    this.rendererSystem = this.el.sceneEl.systems.renderer;
  },

  update: function () {
    const mesh = this.el.getObject3D("mesh");
    if (!mesh) return;

    const materialName = this.data.materialName;
    const color = this.data.color;
    const map = this.data.map;
    const metalness = this.data.metalness;
    const roughness = this.data.roughness;
    const opacity = this.data.opacity;
    mesh.traverse((node) => {
      if (node.material && node.material.name === materialName) {
        if (color !== "") {
          node.material.color.set(color);
          // The following line calls node.material.color.convertSRGBToLinear() when <a-scene renderer="colorManagement:true">
          this.rendererSystem.applyColorCorrection(node.material.color);
        } else {
          this.data.color = "#" + node.material.color.getHexString();
        }

        if (metalness !== -1) {
          node.material.metalness = metalness;
        } else {
          this.data.metalness = node.material.metalness;
        }

        if (roughness !== -1) {
          node.material.roughness = roughness;
        } else {
          this.data.roughness = node.material.roughness;
        }

        if (map) {
          const imageSrc = map;
          const loader = new THREE.TextureLoader();
          loader.load(
            imageSrc,
            function (texture) {
              if (node.material.map) {
                texture.encoding = node.material.map.encoding;
                texture.flipY = node.material.map.flipY;
                texture.offset.copy(node.material.map.offset);
                texture.repeat.copy(node.material.map.repeat);
                texture.wrapS = node.material.map.wrapS;
                texture.wrapT = node.material.map.wrapT;
                node.material.map.dispose();
              }
              node.material.map = texture;
              texture.needsUpdate = true;
              node.material.needsUpdate = true;
            },
            undefined,
            function () {
              console.error(`Error loading ${imageSrc}`);
            }
          );
        }
        node.material.opacity = opacity;
        node.material.transparent = opacity < 1;
        node.material.needsUpdate = true;
      }
    });
  },
});
