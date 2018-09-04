var _= require('underscore');

var nt= {'Array':true,'Object':true},
    isNode= function (val)
    {
       return (typeof val=='object')&&!!nt[val.constructor.name];
    };

module.exports= function traverse(orig,cb,skipDelete)
{
    var stack= [orig],
        push= _.bind(stack.push,stack),
        visited= [],
        wasVisited= function (obj)
        {
            if (obj.__visited!==undefined)
              return true;
            else
            {
              obj.__visited= visited.length;
              visited.push(obj);
              return false;
            }
        };

    while (stack.length)
    {
       var current= stack.pop();

       if (current&&isNode(current))
       {
           if (wasVisited(current)) continue;
     
           if (_.isArray(current))
           {
             if (cb(current)) continue;
             _(current).forEach(push);
           }
           else
           {
             var keys= _.without(_.keys(current),'__visited');
             if (cb(current,keys)) continue;
             _(keys).forEach(function (key)
             {
                push(current[key]);
             });
           }
       }
    }

    if (!skipDelete)
    _(visited).forEach(function (node)
    {
        delete node.__visited;
    });
};

module.exports.isNode= isNode;
