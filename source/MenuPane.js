/* MenuPane.js */
/**
 A Pane/View control that also provides Path/Facebook like menus
 that slide in from the left or right sides

 */
enyo.kind({
	name: "MenuPane",
	published: {
    /** a list menu item controls for the left side menu.
        set 'view' property to the 'name' of the view to display
    */
    menu: "",
    /** a list menu item controls for the right side menu.
        set 'view' property to the 'name' of the view to display
    */
    secondarymenu: "",
    /** a list of controls to swap between.
        set 'name' to match the 'view' of a menu entry.
    */
    views: "",

    //  peek: 52,  - make peek configurable
    //* the currently selected view.  Use setView() and getView() to change w/o menu actions
    view: ""
	},
	events: {
    //* Sent when view changes
    onViewChanged: "",
    //* Sent when left menu opens
    onMenuOpened: "",
    //* Sent when left menu closes
    onMenuClosed: "",
    //* Sent when right menu opens
    onSecondaryMenuOpened: "",
    //* Sent when right menu closes
    onSecondaryMenuClosed: ""
	},

  //* @protected
  classes: "onyx",
  style: "overflow: hidden;",
  position: {  // default to 85% open
    menu: {
      min: 0, max: 85
    },
    secondarymenu: {
      min: -85, max: 0
    }
  },

	components: [
    { name: "menu",
      classes: "enyo-fit menupane-menu",
      ontap: "menuTapHandler"
    },
    { name: "secondarymenu",
      classes: "enyo-fit menupane-menu-secondary",
      showing: false,
      ontap: "menuTapHandler"
    },
    { name: "pane", kind: "onyx.Slideable", classes: "menupane-pane",
      value: 0, min: 0, max: 85, unit: "%", draggable: false,
      style: "width: 100%; height: 100%;",
      onAnimateFinish: "paneAnimateFinishHandler",

      // catch events to toggle menu, rahter than having to pass out and back in?
      onToggleMenu: "toggleMenu",
      onToggleSecondaryMenu: "toggleSecondaryMenu"
    }
  ],

  // TODO: public methods
  //   openMenu();
  //   closeMenu();
  //   openSecondaryMenu();
  //   closeSecondaryMenu();

	//* @public
	//* Select a view by name - does not animate
  selectView: function(name) {
    var views = this.$.pane.getControls();

    // names must be unique, and must exist
    enyo.forEach(views, function(view) {
      if (view.name == name) {
        view.show();
      } else {
        view.hide();
      }
    }, this);
    this.doViewChanged(name);
  },

  //* toggles the main menu
  toggleMenu: function(inSender, ionOriginator, secondary) {
    this.$.menu.setShowing((!secondary));
    this.$.secondarymenu.setShowing(secondary);
    this.$.pane.setMax(secondary ? this.position.secondarymenu.max : this.position.menu.max);
    this.$.pane.setMin(secondary ? this.position.secondarymenu.min : this.position.menu.min);
    this.$.pane.toggleMinMax();
  },

  //* toggles the secondary main menu
  toggleSecondaryMenu: function(inSender, inOriginator) {
    this.toggleMenu(inSender, inOriginator, true);
  },


	//* @protected
	create: function() {
		this.inherited(arguments);
    // TODO: make available via own Kind
    // this.log(this.$.pane.$.animator);
    this.$.pane.$.animator.setDuration(250);
  },

  initComponents: function() {
		this.inherited(arguments);

    this.$.menu.createComponents(this.menu);
    this.$.secondarymenu.createComponents(this.secondarymenu);
    this.$.pane.createComponents(this.views);

    var views = this.$.pane.getControls();
    enyo.forEach(views, function(view) {
      // TODO: fix all this
      view.setOwner(this);
      view.hide();
    }, this);
    if (views && views[0]) {
      this.setView(views[0].name);
    }
  },

  menuTapHandler: function(inSender, inEvent) {
    this.log(inSender, inEvent);

    if (inSender.name == "secondarymenu") {
      this.$.pane.setMax(this.position.secondarymenu.max);
      this.$.pane.setMin(this.position.secondarymenu.min);
    } else {
      this.$.pane.setMax(this.position.menu.max);
      this.$.pane.setMin(this.position.menu.min);
    }

    // walk the chain to find a view
    var getView = enyo.bind(this, function(control) {
      if (control.view) {
        return control.view;
      }
      if ((control == this.$.menu) || (control == this.$.secondarymenu)) {
        return null;
      }
      return getView(control.parent);
    });

    var view = getView(inEvent.originator);

    this.log(view);

    if (view) {
      if (this.getView() == view) {
        this.$.pane["animateTo"  + (inSender.name == "secondarymenu" ? "Max" : "Min")]();
        // dont need to set view
      } else {
        this.$.pane.$.animator.setDuration(200);
        this.$.pane.animateTo((inSender.name == "secondarymenu") ? -100 : 100);
        this.toview = view;
      }
    }
  },

  viewChanged: function(oldView) {
    this.selectView(this.getView());
  },

  paneAnimateFinishHandler: function(inSender) {
    var value = inSender.getValue();

    if (Math.abs(value) == 100) {

      // swap views only when they're off the side
      if (this.toview) {
        this.setView(this.toview);
        this.toview = null;
      }
      setTimeout(enyo.bind(this, function() {
        this.$.pane.$.animator.setDuration(250);
        (value < 0) ? inSender.animateToMax() : inSender.animateToMin();
      }), 1);

    } else {

      // fire events
      if (this.$.menu.getShowing()) {
        if (inSender.getValue() == this.position.menu.max) {
          this.doMenuOpened();
        } else {
          this.doMenuClosed();
        }
      } else {
        if (inSender.getValue() == this.position.secondarymenu.min) {
          this.doSecondaryMenuOpened();
        } else {
          this.doSecondaryMenuClosed();
        }
      }

    }

  }

});