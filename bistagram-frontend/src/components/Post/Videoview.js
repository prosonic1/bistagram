import React from 'react';

const Videoview = ({media}) => {
    return (
      <div className="videowrap_div">
        <div className="video_div">
          <video className="img_100" src={`/upload/${media.medianame}`} loop>
          </video>
        </div>
      </div>
    )
}

export default Videoview;
