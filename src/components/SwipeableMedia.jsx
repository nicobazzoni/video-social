import React from "react";
import { useSwipeable } from "react-swipeable";

const SwipeableMedia = ({file, idx}) => {
    const handlers = useSwipeable({
        onSwipedDown: () => document.exitFullscreen()
    });

    const isVideo = file.url.includes(".mp4") || file.url.includes(".mov") || file.url.includes(".avi");

    return isVideo ? (
        <video {...handlers} 
            className="p-1 h-96 w-full border rounded m-2" 
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
            className="object-cover h-96 w-full overflow-hidden rounded border-2 m-2"
            onClick={(event) => {
                if (event.currentTarget.requestFullscreen) {
                    event.currentTarget.requestFullscreen();
                }
            }}
        />
    );
}

export default SwipeableMedia;