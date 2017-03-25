define(['ko', 'text!./wishit-app.html'], function(ko, template) {
    function WishViewModel(){
      this.title = ko.observable('');
    }

    function WishlistViewModel() {
      this.title = ko.observable('');
      this.wishes = ko.observableArray([]);
      this.addWish = () => {
        var wish = new WishViewModel();
        this.wishes.push(wish);
      };
    }

    function getStoredWishlists() {
      var wishitAppData = JSON.parse(localStorage.getItem('wishit-app') || null);
      if (!wishitAppData) {
        return [];
      }
      return (wishitAppData.wishlists || []).map(wishlist => {
          var wishlistViewModel = new WishlistViewModel();
          wishlistViewModel.title(wishlist.title);
          var wishViewModels = (wishlist.wishes || []).map(wish => {
            var wishViewModel = new WishViewModel();
            wishViewModel.title(wish.title);
            return wishViewModel;
          });
          wishlistViewModel.wishes(wishViewModels);
          return wishlistViewModel;
      });
    }

    function WishitAppViewModel() {
      this.wishlists = ko.observableArray(getStoredWishlists());
      this.currentWishlist = ko.observable(this.wishlists()[0]);
      this.undoDeleteWishlist = ko.observable(null);
      this.isCurrentWishlist = (wishlist) => {
        return wishlist === this.currentWishlist();
      };
      this.addWishlist = (wishlist) => {
        var wishlist = (wishlist instanceof WishlistViewModel) ? wishlist : new WishlistViewModel();
        this.undoDeleteWishlist(null);
        this.currentWishlist(wishlist);
        this.wishlists.push(wishlist);
      };
      this.editWishlist = (wishlist) => {
        this.currentWishlist(wishlist);
      };
      this.deleteWishlist = (wishlist) => {
        this.wishlists.remove(wishlist);
        this.currentWishlist(null);
        this.undoDeleteWishlist(wishlist);
        setTimeout(() => {
          this.undoDeleteWishlist(null);
        }, 2500);
      };
      ko.pureComputed(() => ko.toJSON(this))
        .subscribe(json => {
          localStorage.setItem('wishit-app', json);
        });
    }

    return {
      viewModel: WishitAppViewModel,
      template: template
    }
});
