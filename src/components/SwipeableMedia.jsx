import React from "react";
import { useSwipeable } from "react-swipeable";

const SwipeableMedia = ({file, idx}) => {
    const handlers = useSwipeable({
        onSwipedDown: () => document.exitFullscreen()
    });

    const isVideo = file.url.includes(".mp4") || file.url.includes(".mov") || file.url.includes(".avi");

    return isVideo ? (
        <video {...handlers} 
            className="p-1 h-96 w-full m-1 object-cover border-none rounded " 
            key={idx} 
            src={file.url} 
            width="380" 
            height="240" 
            controls
            onClick={(event) => {
                if (event.currentTarget.requestFullscreen) {
                    event.currentTarget.requestFullscreen();
                }
            }}
        >
            Your browser does not support the video tag.
        </video>
    ) : (
        <img {...handlers} 
            key={idx} 
            src={file.url} 
            alt="user upload" 
            className="object-cover h-96 w-full m-1 p-1 overflow-hidden rounded border-none shadow-xl shadow-black  "
            onClick={(event) => {
                if (event.currentTarget.requestFullscreen) {
                    event.currentTarget.requestFullscreen();
                }
            }}
        />
    );
}

export default SwipeableMedia;