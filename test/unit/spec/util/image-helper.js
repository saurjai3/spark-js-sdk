var assert = require('chai').assert;
var fh2 = require('../../../integration/lib/fixtures-v2');
var ImageHelper = require('../../../../src/util/image-helper');
var sinon = require('sinon');

describe('readExifData()', function() {
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
        width: 362
      },
      mimeType: 'image/jpeg',
      objectType: 'file',
    };

    return fh2.fetchFixtures(fixtures)
      .then(function() {
        var f = fixtures.fixture;
        ImageHelper.readExifData(sampleFile, f)
          .then(function(res) {
            assert.equal(res, f);
            assert.equal(sampleFile.image.orientation, 7);
          });
      });
  });
});

describe('orient()', function() {
  var file = {
    displayName: 'Portrait_7.jpg',
    fileSize: 405822,
    type: 'image/jpeg',
    image: {
      height: 300,
      width: 362
    },
    mimeType: 'image/jpeg',
    objectType: 'file',
  };
  var options = {
    img: 'SampleImage.jpg',
    x: 0,
    y: 0,
    width: 362,
    height: 300,
    ctx: {
      save: sinon.stub().returns(true),
      translate: sinon.stub().returns(true),
      rotate: sinon.stub().returns(true),
      scale: sinon.stub().returns(true),
      drawImage: sinon.stub().returns(true),
      restore: sinon.stub().returns(true)
    }
  };
  [1, 2, 3, 4, 5, 6, 7, 8].forEach(function(orientation) {
    var msg;
    // just changing the orientation to make sure that the function is correctly processing the inputs
    options.orientation = orientation;
    file.image.orientation = orientation;
    ImageHelper.orient(options, file);
    switch (orientation) {
    case 2:
      msg = 'flipImage';
      assert.isTrue(options.ctx.save.called);
      assert.isTrue(options.ctx.translate.calledWith(options.x + options.width / 2, options.y + options.height / 2));
      assert.isTrue(options.ctx.drawImage.calledWith(options.img, -options.width / 2, -options.height / 2, options.width, options.height));
      assert.isTrue(options.ctx.restore.called);
      break;
    case 3:
      msg = 'rotateImage180';
      assert.isTrue(options.ctx.save.called);
      assert.isTrue(options.ctx.translate.calledWith(options.x + options.width / 2, options.y + options.height / 2));
      assert.isTrue(options.ctx.drawImage.calledWith(options.img, -options.width / 2, -options.height / 2, options.width, options.height));
      assert.isTrue(options.ctx.restore.called);
      assert.isTrue(options.ctx.rotate.calledWith(2 * Math.PI - 180 * Math.PI / 180));
      break;
    case 4:
      msg = 'rotate180AndFlipImage';
      assert.isTrue(options.ctx.save.called);
      assert.isTrue(options.ctx.translate.calledWith(options.x + options.width / 2, options.y + options.height / 2));
      assert.isTrue(options.ctx.drawImage.calledWith(options.img, -options.width / 2, -options.height / 2, options.width, options.height));
      assert.isTrue(options.ctx.restore.called);
      assert.isTrue(options.ctx.rotate.calledWith(180 * Math.PI / 180));
      assert.isTrue(options.ctx.scale.calledWith(-1, 1));
      break;
    case 5:
      msg = 'rotate270AndFlipImage';
      assert.isTrue(options.ctx.save.called);
      assert.isTrue(options.ctx.translate.calledWith(options.x + options.width / 2, options.y + options.height / 2));
      assert.isTrue(options.ctx.drawImage.calledWith(options.img, -options.width / 2, -options.height / 2, options.width, options.height));
      assert.isTrue(options.ctx.restore.called);
      assert.isTrue(options.ctx.rotate.calledWith(270 * Math.PI / 180));
      assert.isTrue(options.ctx.scale.calledWith(-1, 1));
      break;
    case 6:
      msg = 'rotateImage270';
      assert.isTrue(options.ctx.save.called);
      assert.isTrue(options.ctx.translate.calledWith(options.x + options.width / 2, options.y + options.height / 2));
      assert.isTrue(options.ctx.drawImage.calledWith(options.img, -options.width / 2, -options.height / 2, options.width, options.height));
      assert.isTrue(options.ctx.restore.called);
      assert.isTrue(options.ctx.rotate.calledWith(2 * Math.PI - 270 * Math.PI / 180));
      break;
    case 7:
      msg = 'rotateNeg90AndFlipImage';
      assert.isTrue(options.ctx.save.called);
      assert.isTrue(options.ctx.translate.calledWith(options.x + options.width / 2, options.y + options.height / 2));
      assert.isTrue(options.ctx.drawImage.calledWith(options.img, -options.width / 2, -options.height / 2, options.width, options.height));
      assert.isTrue(options.ctx.restore.called);
      assert.isTrue(options.ctx.rotate.calledWith(90 * Math.PI / 180));
      assert.isTrue(options.ctx.scale.calledWith(-1, 1));
      break;
    case 8:
      msg = 'rotateNeg90';
      assert.isTrue(options.ctx.save.called);
      assert.isTrue(options.ctx.translate.calledWith(options.x + options.width / 2, options.y + options.height / 2));
      assert.isTrue(options.ctx.drawImage.calledWith(options.img, -options.width / 2, -options.height / 2, options.width, options.height));
      assert.isTrue(options.ctx.restore.called);
      assert.isTrue(options.ctx.rotate.calledWith(2 * Math.PI - 90 * Math.PI / 180));
      break;
    default:
      msg = 'do nothing';
      break;
    }
    it(msg + ' on the canvas if image orientation is ' + orientation, /* eslint complexity: ["error", 9] */ function() {});
  });
});