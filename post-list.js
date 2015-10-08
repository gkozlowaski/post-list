Posts = new Mongo.Collection("posts");

if (Meteor.isClient) {  
  //Routes
  Router.route('/', function () {
    this.layout('AppTemplate');
    this.render('List');
    this.render('ListTitle', {to: 'Title'});
  });
  
  Router.route('/admin', function () {
    this.layout('AppTemplate');
    this.render('Admin');
    this.render('AdminTitle', {to: 'Title'});
  });
  
  Router.route('/:_id', function () {
    this.layout('AppTemplate');
    this.render('Description', {
      //Accessing the requested post in the collection
      data: function () {
        return Posts.findOne({_id: this.params._id});
      }
    });
    this.render('DescriptionTitle', {to: 'Title', data: function () {
        return Posts.findOne({_id: this.params._id});
      }});
  }, {name: 'post'});  
  
  //Template Helpers
  Template.List.helpers({
    posts: function () {
      return Posts.find({});
    },
  });
  
  //Template Events
  Template.post.events({
    "click td": function (){
      Router.go('post', {_id: this._id});
    }
  });  
  
  Template.Admin.events({
    "submit .new-post": function (event){
      //Prevent default form submit
      event.preventDefault();
      
      //Get title
      var title = event.target.title.value;
      
      //Get description
      var content = event.target.content.value;
      
      //Inserting a post in the collection
      Meteor.call("addPost", title, content);
      
      //Clear form
      event.target.title.value = "";
      event.target.content.value = "";
    },
    "click .delete": function(){
      Meteor.call("removeAll");
    }
    
  });
}

//Methods
Meteor.methods({
  
  //Remove all posts
  removeAll: function(){
    Posts.remove( {} );
  },
  
  //Add post to collection
  addPost: function(title, content){
    //Reducing large titles to fit in layout titles of small screens
    if(title.length > 30) {
      titleMin = title.substring(0,30).concat('...'); 
    }
    else {titleMin = title;}
    
    Posts.insert({
      title: title,
      content: content,
      titleMin: titleMin
    });
  }
});