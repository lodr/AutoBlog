describe('The XRender render', function () {
  'use strict';

  var MockRender = function () {};
  MockRender.extension = 'test';
  MockRender.enabled = true;
  MockRender.prototype.render = function(text, section) {
    return section;
  };

  it('is a proxy render, ' +
     'It delegates into the real one based on the story extension',
    function () {
      expect(AutoBlog.Plugins.XRender).toBeDefined();
    }
  );

  it('it is configurable throught a set of extension hooks.',
    function () {
      expect(AutoBlog.Plugins.XRender.Hooks).toBeDefined();
    }
  );

  it('allows the developer to add / remove other extension renders',
    function () {
      var XRender = AutoBlog.Plugins.XRender;
      expect(XRender.Hooks.test).toBeUndefined();

      XRender.addRender(MockRender);
      expect(XRender.Hooks.test).toEqual([MockRender]);

      XRender.removeRender(MockRender);
      expect(XRender.Hooks.test).toEqual([]);
    }
  );

  it('does not allow the developer to add an extension render twice',
    function () {
      var XRender = AutoBlog.Plugins.XRender;
      XRender.addRender(MockRender);
      XRender.addRender(MockRender);
      expect(XRender.Hooks.test).toEqual([MockRender]);
    }
  );

  it('provides two default hooks for Markdown and Text.',
    function () {
      var hooks = AutoBlog.Plugins.XRender.Hooks;
      expect(Array.isArray(hooks.md)).toBeTruthy();
      expect(Array.isArray(hooks.txt)).toBeTruthy();
    }
  );

  it('selects the proper render when constructed',
    function () {
      var storyPath = 'http://localhost/AutoBlog/Stories/story.ext';
      var xRender = new AutoBlog.Plugins.XRender(storyPath);
      expect(xRender.extension).toBe('ext');
    }
  );

  it('supports a built-in render for Markdown',
    function () {
      var storyPath = 'story.md';
      var xRender = new AutoBlog.Plugins.XRender(storyPath);
      expect(xRender.getRenderClass().extension).toBe('md');
    }
  );

  it('supports a built-in render for text',
    function () {
      var storyPath = 'story.txt';
      var xRender = new AutoBlog.Plugins.XRender(storyPath);
      expect(xRender.getRenderClass().extension).toBe('txt');
    }
  );

  it('has a method render() which delegates in the real render.',
    function () {
      var storyPath = 'story.test',
          testText = 'testText',
          testSection = 'testSection';

      var xRender, XRender = AutoBlog.Plugins.XRender;
      spyOn(MockRender.prototype, 'render');
      XRender.addRender(MockRender);
      xRender = new XRender(storyPath);
      xRender.render(testText, testSection);
      expect(MockRender.prototype.render)
        .toHaveBeenCalledWith(testText, testSection);
    }
  );

  it('has an autodiscoverRenders() utility to add available renders to the hooks.',
    function () {
      window.TestRender1 = function () {};
      window.TestRender1.extension = 'a';
      window.TestRender2 = function () {};
      window.TestRender2.extension = 'b';
      window.TestRender3 = function () {};
      window.TestRender3.extension = 'c';

      var XRender = AutoBlog.Plugins.XRender;
      XRender.autodiscoverRenders();

      expect(XRender.Hooks.a).toEqual([window.TestRender1]);
      expect(XRender.Hooks.b).toEqual([window.TestRender2]);
      expect(XRender.Hooks.c).toEqual([window.TestRender3]);

      delete window.TestRender1;
      delete window.TestRender2;
      delete window.TestRender3;
    }
  );

  describe('A hook', function () {
    it('-if defined- is an (empty) array of renders for each extension',
      function () {
        var renders, hooks = AutoBlog.Plugins.XRender.Hooks;
        for (var extension in hooks) {
          renders = hooks[extension];
          expect(Array.isArray(renders)).toBeTruthy();
        }
      }
    );
  })

});
