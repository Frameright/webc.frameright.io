// See https://interactjs.io/docs/resizable/
// eslint-disable-next-line no-undef
interact('.resizable').resizable({
  edges: { bottom: '.resizer', right: '.resizer' },
  listeners: {
    move(event) {
      let { x, y } = event.target.dataset;

      x = (parseFloat(x) || 0) + event.deltaRect.left;
      y = (parseFloat(y) || 0) + event.deltaRect.top;

      Object.assign(event.target.style, {
        width: `${event.rect.width}px`,
        height: `${event.rect.height}px`,
        transform: `translate(${x}px, ${y}px)`,
      });

      Object.assign(event.target.dataset, { x, y });
    },
  },
});

window.onload = async function () {
  await picSelectorClicked('skater');
  modeSelectorClicked('on');
}

const _IMG_ELEMENT_ID = 'myimg';

async function picSelectorClicked(buttonId) {
  const imgElement = document.getElementById(_IMG_ELEMENT_ID);
  const fileElement = document.getElementById('file');

  switch (buttonId) {
    case 'upload':
      if (!fileElement.hasChangeEventListener) {
        fileElement.hasChangeEventListener = true;
        fileElement.addEventListener('change', picUploaded);
      }

      // See https://stackoverflow.com/questions/4109276/how-to-detect-input-type-file-change-for-the-same-file
      fileElement.value = null;

      fileElement.click();
      break;

    case 'birds':
      setImgSrc('assets/pics/birds.jpg');
      imgElement.srcset = `
        assets/pics/birds_highres.jpg  5391w,
        assets/pics/birds.jpg          1500w
      `
      imgElement.sizes = '(max-width: 5391px) 100vw, 1500px';
      break;

    case 'skater':
    default:
      setImgSrc('assets/pics/skater.jpg');
      imgElement.srcset = `
        assets/pics/skater_highres.jpg  4000w,
        assets/pics/skater.jpg          1500w
      `
      imgElement.sizes = '(max-width: 4000px) 100vw, 1500px';
      break;
  }

  if (!imgElement.hasLoadEventListener) {
    imgElement.hasLoadEventListener = true;
    imgElement.addEventListener('load', picLoaded);
  }

  // Highlight the selected button. Un-highlight the others.
  document.querySelectorAll('.pic-selector').forEach(element => {
    if (element.id === buttonId) {
      element.classList.add('purple');
    } else {
      element.classList.remove('purple');
    }
  });

  function setImgSrc(src) {
    imgElement.src = src;

    // See
    // https://stackoverflow.com/questions/280049/how-to-create-a-javascript-callback-for-knowing-when-an-image-is-loaded
    if (imgElement.complete) {
      picLoaded();
    }
  }

  // Handler called whenever a user has just selected/uploaded a new image file.
  async function picUploaded() {
    if (fileElement.files.length === 0) {
      return;
    }
    URL.revokeObjectURL(imgElement.src); // clean up previously uploaded image
    setImgSrc(URL.createObjectURL(fileElement.files[0]));
    imgElement.removeAttribute('srcset');
    imgElement.removeAttribute('sizes');
  }

  // Handler called whenever imgElement.src's URL has been loaded.
  async function picLoaded() {
    // At this point, imgElement.src has just been loaded, so we now for a fact
    // that it's fresh in the cache, and fetch() can make use of it:
    const image = await fetch(imgElement.src, {
      cache: 'force-cache',
    });

    // Read image regions from the image's metadata and pass them to the web
    // component.
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.Buffer.from(arrayBuffer);
    const parser = new ImageDisplayControl.Parser(buffer);
    const regions = parser.getIdcMetadata('rectangle', 'crop');
    imgElement.dataset.imageRegions = JSON.stringify(regions);
  }
}

function modeSelectorClicked(buttonId) {
  const imgElement = document.getElementById(_IMG_ELEMENT_ID);
  switch (buttonId) {
    case 'off':
      imgElement.dataset.loglevel = 'off';
      imgElement.dataset.disabled = 'all';
      break;

    case 'debug':
      imgElement.dataset.loglevel = 'debug';
      imgElement.dataset.disabled = 'none';
      imgElement.dataset.avoidNoRegion = 'off';
      imgElement.dataset.debugDrawRegions = 'on';
      break;

    case 'on':
    default:
      imgElement.dataset.loglevel = 'off';
      imgElement.dataset.disabled = 'none';
      imgElement.dataset.avoidNoRegion = 'on';
      imgElement.dataset.debugDrawRegions = 'off';
      break;
  }

  // Highlight the selected button. Un-highlight the others.
  document.querySelectorAll('.mode-selector').forEach(element => {
    if (element.id === buttonId) {
      element.classList.add('purple');
    } else {
      element.classList.remove('purple');
    }
  });
}
