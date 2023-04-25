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
  switch (buttonId) {
    case 'car':
      imgElement.src = 'assets/pics/car.webp';
      break;

    case 'surfer':
      imgElement.src = 'assets/pics/surfer.webp';
      break;

    case 'birds':
      imgElement.src = 'assets/pics/birds.webp';
      break;

    case 'skater':
    default:
      imgElement.src = 'assets/pics/skater.webp';
      break;
  }

  // Read image regions from the image's metadata and pass them to the web
  // component.
  const image = await fetch(imgElement.src);
  const arrayBuffer = await image.arrayBuffer();
  const buffer = Buffer.Buffer.from(arrayBuffer);
  const parser = new ImageDisplayControl.Parser(buffer);
  const regions = parser.getIdcMetadata('rectangle', 'crop');
  imgElement.dataset.imageRegions = JSON.stringify(regions);

  // Highlight the selected button. Un-highlight the others.
  document.querySelectorAll('.pic-selector').forEach(element => {
    if (element.id === buttonId) {
      element.classList.add('purple');
    } else {
      element.classList.remove('purple');
    }
  });
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
      imgElement.dataset.debugDrawRegions = 'on';
      break;

    case 'on':
    default:
      imgElement.dataset.loglevel = 'off';
      imgElement.dataset.disabled = 'none';
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
