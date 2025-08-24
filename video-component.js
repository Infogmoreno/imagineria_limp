 "use strict";

  AFRAME.registerComponent("video-component", {
    init: function () {
      this.el.addEventListener("model-loaded", this.update.bind(this));
    },
    update: function () {
      var mesh = this.el.getObject3D("mesh");
      var data = this.data;
      if (!mesh) {
        return;
      }
      mesh.traverse(function (node) {
        
        if (node.isMesh && node.name == "screen") {

          let video1 = setUpVideo(
            "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          );

          let videoTex = createTextureFromVideoElement(video1);

          // videoTex.matrixAutoUpdate = false;
          // videoTex.matrix.setUvTransform( 0, 0, 1, -1, 0, 0.5, 0.5 );

          videoTex.wrapS = THREE.RepeatWrapping;
          videoTex.wrapT = THREE.RepeatWrapping;
          videoTex.repeat.set(2, 3);
          videoTex.offset.set(0.5, -0.5)
          videoTex.rotation = -3.14 / 2

          node.material = new THREE.MeshBasicMaterial({ map: videoTex, side: THREE.DoubleSide, wireframe: false })


        }
      });
    }
  });

  function setUpVideo(inSrc) {
    var videlem = document.createElement("video");
    var sourceMP4 = document.createElement("source");
    sourceMP4.type = "video/mp4";
    sourceMP4.src = inSrc;
    videlem.appendChild(sourceMP4);

    videlem.autoplay = true;
    videlem.muted = true;
    videlem.loop = true
    videlem.setAttribute("crossorigin", "anonymous");
    videlem.style.display = "none";

    videlem.load();
    videlem.play();
    return videlem;
  }

  function createTextureFromVideoElement(video) {
    let texture = new THREE.VideoTexture(video);
    texture.crossOrigin = "anonymous";
    texture.needsUpdate;
    // texture.minFilter = THREE.LinearFilter;
    // texture.magFilter = THREE.LinearFilter;
    // texture.format = THREE.RGBFormat;
    return texture;
  }
