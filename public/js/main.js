var AppRouter = Backbone.Router.extend({

    routes: {
        ""                  : "home",
        "neighborhoods"	: "list",
        "neighborhoods/page/:page"	: "list",
        "neighborhoods/add"         : "addNeighborhood",
        "neighborhoods/:id"         : "neighborhoodDetails",
        "about"             : "about"
    },

    initialize: function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
    },

    home: function (id) {
        if (!this.homeView) {
            this.homeView = new HomeView();
        }
        $('#content').html(this.homeView.el);
        this.headerView.selectMenuItem('home-menu');
    },

	list: function(page) {
        var p = page ? parseInt(page, 10) : 1;
        var neighborhoodList = new NeighborhoodCollection();
        neighborhoodList.fetch({success: function(){
            $("#content").html(new NeighborhoodListView({model: neighborhoodList, page: p}).el);
        }});
        this.headerView.selectMenuItem('home-menu');
    },

    neighborhoodDetails: function (id) {
        var neighborhood = new Neighborhood({_id: id});
        neighborhood.fetch({success: function(){
            $("#content").html(new NeighborhoodView({model: neighborhood}).el);
        }});
        this.headerView.selectMenuItem();
    },

	addNeighborhood: function() {
        var neighborhood = new Neighborhood();
        $('#content').html(new NeighborhoodView({model: neighborhood}).el);
        this.headerView.selectMenuItem('add-menu');
	},

    about: function () {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('#content').html(this.aboutView.el);
        this.headerView.selectMenuItem('about-menu');
    }

});

utils.loadTemplate(['HomeView', 'HeaderView', 'NeighborhoodView', 'NeighborhoodListItemView', 'AboutView'], function() {
    app = new AppRouter();
    Backbone.history.start();
});