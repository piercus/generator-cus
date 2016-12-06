var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  // The name `constructor` is important here
  constructor: function () {
    // Calling the super constructor is important so our generator is correctly set up
    generators.Base.apply(this, arguments);
  },

  prompting: function() {
    var done = this.async();
    this.prompt({
      type: 'input',
      name: 'name',
      message: 'Your project name',
      //Defaults to the project's folder name if the input is skipped
      default: this.appname
    }).then(function(answers) {
      this.props = answers
      this.log(answers.name);
      done();
    }.bind(this));
  },
  end:  function () {
    this.log("end")
  },

  //Writing Logic here
  writing: {
    //Copy the configuration files
    config: function () {
        this.fs.copyTpl(
            this.templatePath('_package.json'),
            this.destinationPath('package.json'), {
                name: this.props.name
            }
        );
        this.fs.copy(
          this.templatePath('_gitignore'),
          this.destinationPath('.gitignore'),{
              name: this.props.name
          }
        );
        this.fs.copy(
          this.templatePath('_README.md'),
          this.destinationPath('README.md'),{
              name: this.props.name
          }
        );
        this.fs.copy(
          this.templatePath('_gruntfile.js'),
          this.destinationPath('gruntfile.js'),{
              name: this.props.name
          }
        );
        this.fs.copy(
          this.templatePath('gruntfile/_requirejs-vows.json'),
          this.destinationPath('gruntfile/requirejs-vows.json'),
          this.props
        );
    },

    //Copy application files

    //Install Dependencies
    install: function() {
      this.installDependencies();
    }
  },
});
