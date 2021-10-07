export default function convertFolge({ name, images, id, release_date }) {
  const folge = {
    images,
    release_date,
    spotify_id: id,
  };

  if (name.includes('/')) {
    folge.isSpecial = false;
    folge.type = 'regular';
    folge.number = name.split('/')[0];
    folge.name = name.split('/')[1];
  } else if (name.includes(':')) {
    folge.isSpecial = false;
    folge.type = 'regular';
    folge.number = name.split(':')[0];
    folge.name = name.split(':')[1];
  } else {
    folge.isSpecial = true;
    folge.type = 'special';
    folge.number = '';
    folge.name = name;
  }

  return folge;
}
