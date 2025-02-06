const sharp = require('sharp');
const fs = require('fs');

var argv = require('minimist')(process.argv.slice(2));

var formatRegex = /(jpg|jpeg|png|tiff|webp)$/i;

const quality = {
	jpeg: { mozjpeg: true, quality: argv.quality },
	webp: { quality: argv.quality },
	png: { quality: argv.quality },
	tiff: { quality: argv.quality },
};

var imageOptimizer = argv.image;

(async () => {
	try {
		sharp.cache(false);
		
		const metadata = await sharp(imageOptimizer).metadata();

		var match = metadata.format.match(formatRegex);		
		if ( !match ) throw "couldn't optimize image! Unsupported image format";
		
		await sharp(imageOptimizer)
			.toFormat(metadata.format, quality[metadata.format])
			.toBuffer((err, data, info) => {
				fs.writeFile(imageOptimizer, data, (err) => {
					if (err) {
						throw err;
					} else {
						console.log('The optimized image has been saved!');
					}
				});
			});
	} catch (error) {
		console.log(`An error occurred during processing: ${error}`);
	}
})();
