# Comments

First, some considerations:
- time is limited so the app does not need to be perfect
- hence no tests, no a11y, no translations
- mobile support is basic, action buttons are shown on the bottom of the screen
- test is for frontend so code quality for backend is less important

### Challenges
- The images are 50mb each, had to find a way to switch btw images without lagging. Also this images are not suitable for use as thumbnails. A backend endpoint were created that generate and return scaled-down version of images. 
  - `/image/{name}/{level}`, returns scaled-down version of the image. `/1` is half width and height. `/2` is quarter, etc. Images are generated up to level `/4`. 
  - The app uses `/4` for previews and `/2` for general overview. When zoomed in, the hi-res image is displayed, yielding reasonable performance.
- The images have to be cached locally. Storing them in IndexedDB.
- Pan/zoom takes too much time to implement manually. A 3rd party component was used (which caused a few more minor challenges and needed some quirks, but it works)

### Further improvements
- TypeScript. Should dramatically increase quality of the code and helps avoiding stupid mistakes
- Performance
  - useCallbacks when possible
  - avoid pin rerenders when zooming
  - the transition from /2 mipmap to full resolution image is laggy
  - store full res image as tiles and load them on demand, similar to how google maps do that  
  - make sure unused images are not stored in memory anymore
- Features
  - add mini map. Helps greatly with navigating on the image and not getting lost
  - add pin counters to image previews
- Write tests