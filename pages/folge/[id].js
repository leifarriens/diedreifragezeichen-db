import { useContext, useEffect } from 'react'
import Link from 'next/link'
import {
  Container,
  Cover,
  Content,
  Buttons,
  Background,
} from '../../components/Folge/StyledFolge'
import { calcFolgenRating, sortFolgenByDateAsc } from '../../utils'
import dayjs from 'dayjs'

import Rating from '../../components/Rating'

import { GlobalContext } from '../../context/GlobalContext'
import { useRouter } from 'next/router'

function Folge(props) {
  const { folgen } = useContext(GlobalContext)
  const {
    images,
    name,
    release_date,
    _id,
    ratings,
    number,
    spotify_id,
  } = props.folge
  const rating = calcFolgenRating(ratings) || 0
  const isBigCover = Number(number) >= 125 ? true : false
  const router = useRouter()
  let sortedFolgen = sortFolgenByDateAsc(folgen)
  sortedFolgen = sortedFolgen.filter((f) => f.type === 'regular')

  const currIndex = sortedFolgen.findIndex((f) => f._id === _id)

  const prevFolge = sortedFolgen[currIndex - 1]
  const nextFolge = sortedFolgen[currIndex + 1]

  const prevLink = prevFolge && sortedFolgen[currIndex - 1]._id
  const nextLink = nextFolge && sortedFolgen[currIndex + 1]._id

  const _handleKeyNavigation = (e) => {
    if (prevFolge && e.key === 'ArrowLeft') {
      router.push('/folge/' + prevLink)
    }

    if (nextFolge && e.key === 'ArrowRight') {
      router.push('/folge/' + nextLink)
    }
  }

  useEffect(() => {
    document.removeEventListener('keydown', _handleKeyNavigation)
    document.addEventListener('keydown', _handleKeyNavigation)
  }, [props.folge])

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

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
      </div>

      <Background url={images[0].url} bigCover={isBigCover} />
    </Container>
  )
}

export async function getServerSideProps(context) {
  const id = context.params.id
  console.log(id);
  const res = await fetch(process.env.API_URL + '/api/folgen/' + id)
  const folge = await res.json(res)

  return {
    props: {
      folge
    }
  }
}

export default Folge
