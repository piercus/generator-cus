var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  // The name `constructor` is important here
  constructor: function () {
    // Calling the super constructor is important so our generator is correctly set up
    generators.Base.apply(this, arguments);
  },

  prompting: function() {
    var done = this.async();
    this.prompt([{
      type: 'input',
      name: 'methodName',
      message: 'Service to test'
    },{
      type: 'input',
      name: 'folder',
      message: 'Folder',
      //Defaults to the project's folder name if the input is skipped
      default: this.appname
    },{
      type: 'input',
      name: 'input',
      message: 'Json input',
      //Defaults to the project's folder name if the input is skipped
      default: "{}"
    },{
      type: 'input',
      name: 'async',
      message: 'Is async ?',
      //Defaults to the project's folder name if the input is skipped
      default: "true"
    }]).then(function(answers) {
      this.props = answers
      this.props.fullTestMethodName = "test/"+answers.folder+"/"+answers.methodName;
      this.props.fullTestedMethodName = answers.folder+"/"+answers.methodName;
      this.log(this.props);
      done();
    }.bind(this));
  },
  end:  function () {
    this.log("end")
  },

  //Writing Logic here
  writing: {
    //Copy the configuration files
    app: function () {
        this.fs.copyTpl(
            this.templatePath('test-rjs-vows.js'),
            this.destinationPath(this.props.fullTestMethodName+'.js'),
            this.props
        );
        this.fs.copyTpl(
            this.templatePath('basicMethod.js'),
            this.destinationPath(this.props.fullTestedMethodName+'.js'),
            this.props
        );

        var requirejsVowsConfig = this.fs.readJSON(this.destinationPath('gruntfile/requirejs-vows.json'));

        for(var k in requirejsVowsConfig) if(requirejsVowsConfig.hasOwnProperty(k)){
          if(requirejsVowsConfig[k].options.rjsModules.indexOf(this.props.fullTestMethodName) == -1){
            requirejsVowsConfig[k].options.rjsModules.push(this.props.fullTestMethodName);
          }
        }
        this.fs.writeJSON(this.destinationPath('gruntfile/requirejs-vows.json'), requirejsVowsConfig, null, 4);

    },
  },
});
