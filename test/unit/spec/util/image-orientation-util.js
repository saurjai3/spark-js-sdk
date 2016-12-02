var assert = require('chai').assert;
var fh2 = require('../../../integration/lib/fixtures-v2');
var ImageOrientationUtil = require('../../../../src/util/image-orientation-util');
var sinon = require('sinon');

describe('getExifData()', function() {
  it('adds exif orientation information on the image file', function() {
    var fixtures = {
      fixture: 'Portrait_7.jpg'
    };

    var sampleFile = {
      displayName: 'Portrait_7.jpg',
      fileSize: 405822,
      type: 'image/jpeg',
      image: {
        height: 300,
        url: 'https://beta.webex.com/files/api/v1/spaces/511192c2-7916-4299-a1b3-4194b62a…9c7-423e-992e-395584185faa/versions/0ad8714c2cc940bcb01eb08aa6aa0fe3/bytes',
        objectURL: 'blob:https://beta.webex.com/files/api/v1/spaces/6f452b94-9a83-43d9-ab05-0eb269da…a6a-4df7-9584-3c25df698a3d/versions/cc3945d2676b4055a1442b10c796761c/bytes',
        width: 362
      },
      mimeType: 'image/jpeg',
      objectType: 'file',
    };

    return fh2.fetchFixtures(fixtures)
      .then(function() {
        var f = fixtures.fixture;
        ImageOrientationUtil.getExifData(sampleFile, f)
          .then(function(res) {
            assert.equal(res, f);
            assert.equal(sampleFile.image.orientation, 7);
          })
      });
  });
});

describe('setImageOrientation()', function() {
  it('rotates/flips the image on the canvas as per exif information', function() {
    ImageOrientationUtil.drawImage = sinon.spy();
    var options = {
      img: 'Portrait_7.jpg',
      x: 0,
      y: 0,
      width: 362,
      height: 300,
      ctx: {},
      orientation: 7
    };
    ImageOrientationUtil.setImageOrientation(options);
    assert(ImageOrientationUtil.drawImage.calledWith({
      img: options.img,
      x: 0,
      y: 0,
      width: options.width,
      height: options.height,
      deg: 90,
      flip: true,
      ctx: options.ctx
    }));
  });
});

// describe('fixImageOrientation()', function() {
//   it('fetches and updates the image file with exif information', function() {
//     var fixtures = {
//       fixture: 'Portrait_7.jpg'
//     };
//
//     var sampleFile = {
//       displayName: 'Portrait_7.jpg',
//       fileSize: 405822,
//       type: 'image/jpeg',
//       image: {
//         height: 300,
//         url: 'https://beta.webex.com/files/api/v1/spaces/511192c2-7916-4299-a1b3-4194b62a…9c7-423e-992e-395584185faa/versions/0ad8714c2cc940bcb01eb08aa6aa0fe3/bytes',
//         objectURL: 'blob:https://beta.webex.com/files/api/v1/spaces/6f452b94-9a83-43d9-ab05-0eb269da…a6a-4df7-9584-3c25df698a3d/versions/cc3945d2676b4055a1442b10c796761c/bytes',
//         width: 362
//       },
//       mimeType: 'image/jpeg',
//       objectType: 'file',
//     };
//
//     return ImageOrientationUtil.fixImageOrientation(fixtures.fixture)
//       .then(function(buf) {
//         console.log('@@@@@ buf=', buf);
//       })
//       .then(function(buf) {
//         return fh2.fetchFixtures(fixtures)
//       })
//       .then(function(fixtures, buf) {
//         var f = fixtures.fixture;
//         assert.equal(buf, f);
//       });
//   });
// });