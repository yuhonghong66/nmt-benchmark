$(document).ready(function () {
  // Enable dropdowns
  $('.ui.dropdown').dropdown();

  // DataTable configuration
  var dtConfig = {
    url: '/download/test/',
    target: '#testSetTable',
    type: 'test',
    columns: [
      {data: 'languagePair', render: function (data, type, full) {
        return [c2l[full.source.language], c2l[full.target.language]].join('&nbsp;-&nbsp;');
      }},
      {data: 'domain'},
      {data: 'origin'},
      {data: 'source.fileName'},
      {data: 'download', sortable: false, sDefaultContent: '', render: function (data, type, full) {
        return '<div class="downloadSrc circular ui basic icon fireBrick button" data-fileId="' + full._id + '"><i class="download icon"></i></div>'
      }}
    ]
  }

  // Language pair selection handler
  $('#languagePairs').dropdown({
    onChange: function (value, text) {
      if (!value) {
        $('#languagePairs').dropdown('restore defaults');
      }
      getTable(filterByLp(testSets, value), dtConfig);
    }
  });

  // Draw table
  getTable(filterByLp(testSets, null), dtConfig);
});
