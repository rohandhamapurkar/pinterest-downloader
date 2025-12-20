# Pinterest Downloader

This project downloads images from Pinterest using Node.js scripts.

## Files
- `index.js`: Main entry point or orchestrator.
- `download-pin-images.js`: Downloads images from Pinterest URLs.
- `extract-pinimg-src.js`: Extracts image source URLs from Pinterest pages.
- `urls.txt`: List of Pinterest URLs to process.
- `pin_images/`: Directory where downloaded images are stored.
- `download_log.txt`: Log of download activity.
- `urls_out.txt`, `pinimg_out.txt`: Output files for processed URLs and image sources.

## Usage
1. Install dependencies:
   ```
   npm install
   ```
2. Run the scripts as needed:
   ```
   node extract-pinimg-src.js
   node download-pin-images.js
   ```

## License
MIT License

---

MIT License

Copyright (c) 2025 rohandhamapurkar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
