import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  Container,
  Cover,
  Content,
  Buttons,
  Background,
} from './StyledFolge'
import { calcFolgenRating, sortFolgenByDateAsc } from '../../utils'
import Rating from '../Rating'
import dayjs from 'dayjs'

const Folge = ({ folge }) => {
  const {
    images,
    name,
    release_date,
    _id,
    ratings,
    number,
    spotify_id,
  } = folge
  const rating = calcFolgenRating(ratings) || 0
  const isBigCover = Number(number) >= 125 ? true : false
  // const router = useRouter()

  // let sortedFolgen = sortFolgenByDateAsc(folgen)
  // sortedFolgen = sortedFolgen.filter((f) => f.type === 'regular')

  // const currIndex = sortedFolgen.findIndex((f) => f._id === _id)

  // const prevFolge = sortedFolgen[currIndex - 1]
  // const nextFolge = sortedFolgen[currIndex + 1]

  // const prevLink = prevFolge && sortedFolgen[currIndex - 1]._id
  // const nextLink = nextFolge && sortedFolgen[currIndex + 1]._id

  // const _handleKeyNavigation = (e) => {
  //   if (prevFolge && e.key === 'ArrowLeft') {
  //     router.push('/folge/' + prevLink)
  //   }

  //   if (nextFolge && e.key === 'ArrowRight') {
  //     router.push('/folge/' + nextLink)
  //   }
  // }

  // useEffect(() => {
  //   document.removeEventListener('keydown', _handleKeyNavigation)
  //   document.addEventListener('keydown', _handleKeyNavigation)
  // }, [folge])

  return (
    <Container className="wrapper">
      <Cover>
        <img src={images[0].url} />
      </Cover>
      <Content>
        <h2>Die drei ???</h2>
        <h1>{name}</h1>
        <div>Veröffentlicht am {dayjs(release_date).format('DD.MM.YYYY')}</div>
        <div>
          <span style={{ fontSize: '30px' }}>{rating.toFixed(1)}/10</span>
        </div>
        <Rating folge_id={_id} defaultRating={rating} />

        <Buttons>
          <a
            className="button"
            target="_blank"
            rel="noreferrer"
            href={`spotify:album:${spotify_id}`}
          >
            Anhören
          </a>
          {/* <AddToList folge={folge}/> */}
        </Buttons>
      </Content>

      {/* <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {prevLink && (
          <Link href={`/folge/${prevLink}`}>
            <a>Previous</a>
          </Link>
        )}

        {nextLink && (
          <Link href={`/folge/${nextLink}`}>
            <a>Next</a>
          </Link>
        )}
      </div> */}

      <Background url={images[0].url} bigCover={isBigCover} />
    </Container>
  )
}

export default Folge;