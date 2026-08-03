import classNames from 'classnames';

interface AvatarProps {
  url?: string | null;
}

export function Avatar({ url }: AvatarProps) {
  const src = url ?? '/white_small.png';

  return (
    <img
      src={src}
      className={classNames('h-9 w-9 rounded-full shadow-md', {
        'object-cover': url,
        'bg-gray-500 object-contain p-2': !url,
      })}
      referrerPolicy="no-referrer"
      alt=""
    />
  );
}
