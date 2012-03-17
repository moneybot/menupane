/* App.js */

enyo.kind({
	name: "App",
  classes: "enyo-unselectable",
	components: [
    // height necessary.
    { name: "menupane", kind: "MenuPane",
      style: "height: 600px; width: 360px; background-color: black;",
      onViewChanged: "viewChangedHandler",
      onMenuOpened: "menuOpenedHandler",
      onMenuClosed: "menuClosedHandler",
      onSecondaryMenuOpened: "secondaryMenuOpenedHandler",
      onSecondaryMenuClosed: "secondaryMenuClosedHandler",
      menu: [
        { content: "Primary Menu", classes: "menu-header" },
        { content: "A", view: "a", classes: "menu-item" },
        { view: "b", classes: "menu-item",
          components: [ { content: "B" }, { content: "[1]" } ] },
        { content: "More Header", classes: "menu-header" },
        { content: "C", view: "c", classes: "menu-item" },
        { content: "D", view: "d", classes: "menu-item" }
      ],
      secondarymenu: [
        { content: "Secondary Menu", classes: "menu-header" },
        { content: "E", view: "e", classes: "menu-item" },
        { content: "F", view: "f", classes: "menu-item" }
      ],
      views: [
        { name: "a",
          components: [ { kind: "Toolbar" }, { content: "[View A]", style: "background-color: red" } ]
        },
        { name: "b",
          components: [ { kind: "Toolbar" }, { content: "[View B]", style: "background-color: blue" } ]
        },
        { name: "c",
          components: [ { kind: "Toolbar" }, { content: "[View C]", style: "background-color: green" } ]
        },
        { name: "d",
          components: [ { kind: "Toolbar" }, { content: "[View D]", style: "background-color: orange" } ]
        },
        { name: "e",
          components: [ { kind: "Toolbar" }, { content: "[View E]", style: "background-color: purple" } ]
        },
        { name: "f",
          components: [ { kind: "Toolbar" }, { content: "[View F]" } ]
        }
      ]
    }
  ],

  viewChangedHandler: function(inSender, inEvent) {
    this.log();
  },
  menuOpenedHandler: function(inSender, inEvent) {
    this.log();
  },
  menuClosedHandler: function(inSender, inEvent) {
    this.log();
  },
  secondaryMenuOpenedHandler: function(inSender, inEvent) {
    this.log();
  },
  secondaryMenuClosedHandler: function(inSender, inEvent) {
    this.log();
  }

});