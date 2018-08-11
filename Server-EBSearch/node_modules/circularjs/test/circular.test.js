var should= require('chai').should(),
    assert= require('chai').assert,
    _= require('underscore'),
    traverse=  require('../index.js');

var cir= function ()
{
    var a= { nome: 'Andrea' },
        e= { nome: 'Elena' };

    a.figlia= e;
    a.figlia2= e;
    e.papa= a;

    return [a,3,[e,a]];
};

describe('traverse',function ()
{
       describe('isNode',function ()
       {
           it('returns true for an object {}', function (done)
           {
               traverse.isNode({}).should.equal(true);
               done();
           });

           it('returns true for an array []', function (done)
           {
               traverse.isNode([]).should.equal(true);
               done();
           });

           it('returns false for a number', function (done)
           {
               traverse.isNode(1).should.equal(false);
               done();
           });

           it('returns false for a string', function (done)
           {
               traverse.isNode('a').should.equal(false);
               done();
           });

           it('returns false for a Date', function (done)
           {
               traverse.isNode(new Date()).should.equal(false);
               done();
           });

           it('returns false for a RegExp', function (done)
           {
               traverse.isNode(/^/).should.equal(false);
               done();
           });
       });

       it('exits a circular structure', function (done)
       {
          process.nextTick(function ()
          {
              traverse(cir(),function ()
              {
              });

              done();
          });
       });

       it('calls the callback for every node (object or array) in the graph including the root node', function (done)
       {
          var cnt= 0;

          traverse(cir(),function (node)
          {
            traverse.isNode(node).should.equal(true);
            cnt++;
          });

          cnt.should.equal(4);

          done();
       });
});
