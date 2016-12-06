define('<%=fullTestMethodName%>', [
  'assert',
  '<%=fullTestedMethodName%>',
  'grunt-requirejs-vows-options'
],function(assert, <%=methodName%>, testOptions) {

  return function(cb){

      cb(null, [{
            name : "test <%=methodName%> function",
            input: <%=input%>,
            outputError : false,
            async : <%=async%>,
            fn : <%=methodName%>
        }]);
    };

});
