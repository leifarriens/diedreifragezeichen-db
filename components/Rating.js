import React, { useContext } from 'react';
import styled from 'styled-components';
import ReactStars from 'react-rating-stars-component';
import { useSession, signIn } from 'next-auth/client';
import { useRouter } from 'next/router';
import { roundRatingToPointFive } from '../utils';
import useSWR, { mutate } from 'swr';

const RateIcon = styled.i`
  display: block;
  width: 22px;
  height: 42px;
  background-image: url(${(props) => props.icon});
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
`;

const Rating = ({ folge_id, defaultRating }) => {
  const roundedRating = roundRatingToPointFive(defaultRating);
  const [session] = useSession();

  const router = useRouter();

  // const rateFolge = (value) => {

  //   if (!auth.data) {
  //     location.href = '/login';
  //   } else {
  //     const rating = Number(value);
  //     const url = `/api/folgen/${folge_id}/rating`;

  //     Axios.post(url, {
  //       rating
  //     }, {
  //       headers: {
  //         'Authorization': 'Bearer ' + auth.data.token
  //       }
  //     })
  //     .then(response => {
  //       console.log(response.data);
  //       // window.location.reload();
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  //   }
  // }

  const _handleRateClick = (newRating) => {
    if (!session) return signIn();

    console.log(newRating);
    mutate(`/api/folgen/`, async (respo) => {
      const updatedRating = await fetch(`/api/folgen/${folge_id}/rate`, {
        method: 'POST',
        body: JSON.stringify({ rating: newRating }),
      });

      console.log(updatedRating);
    });
  };

  const settings = {
    style: { display: 'inline-flex' },
    count: 10,
    value: roundedRating,
    isHalf: true,
    emptyIcon: <RateIcon icon={'/white.png'} />,
    halfIcon: <RateIcon icon={'/half.png'} />,
    filledIcon: <RateIcon icon={'/blue.png'} />,
    onChange: (newRating) => _handleRateClick(newRating),
  };

  return <ReactStars {...settings} />;
};

export default Rating;
