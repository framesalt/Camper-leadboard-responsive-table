'use strict';

$(document).ready(function () {

  var Frame = React.createClass({
    displayName: 'Frame',

    makeCalls: function makeCalls(mUrl) {

      $.ajax({

        url: mUrl,
        dataType: 'json',
        cache: false,
        success: function (data) {

          var mData = this.state.data.slice();
          mData.push(data.slice());

          this.setState({

            data: mData
          });
          //console.log("Success, counter: " + this.state.data.length);
        }.bind(this),
        error: function error(xhr, status, err) {
          console.error(this.url, status, err.toString());
        }

      });
    },
    makeCollumns: function makeCollumns(num, obj) {

      // CHECKED THAT OBJ HAVE CORRECT DATA
      console.log("obj[0].username= " + obj[0].username);

      function collumn(i, data) {
        return React.createElement(
          'div',
          { className: 'row rOw-' + i },
          React.createElement(
            'div',
            { className: 'col-xs-1 col-no' },
            i + 1
          ),
          React.createElement(
            'div',
            { className: 'col-xs-5 user-name-' + i },
            React.createElement('img', { className: 'picture user-picture-' + i, src: data.img, alt: 'avatar' }),
            React.createElement(
              'span',
              { className: 'username-span' },
              data.username,
              ' '
            )
          ),
          React.createElement(
            'div',
            { className: 'col-xs-3 user-montly-' + i },
            data.recent
          ),
          React.createElement(
            'div',
            { className: 'col-xs-3 user-alltime-' + i },
            data.alltime
          )
        );
      }

      var markupPredefined = [];
      for (var i = 0; i < num; i++) {
        markupPredefined.push(collumn(i, obj[i]));
      }return markupPredefined;
    },

    getInitialState: function getInitialState() {
      var self = this;
      setTimeout(function () {

        self.makeCalls('https://fcctop100.herokuapp.com/api/fccusers/top/alltime');

        setTimeout(function () {
          self.makeCalls('https://fcctop100.herokuapp.com/api/fccusers/top/recent');
        }, 100);
      }, 0);
      return {
        data: []
      };
    },
    render: function render() {

      if (this.state.data.length == 2) {
        var maxCollumns = this.state.data[1].length > this.state.data[0].length ? this.state.data[1].length : this.state.data[0].length;
        var arr = this.makeCollumns(maxCollumns, this.props.montlySort ? this.state.data[1] : this.state.data[0]);

        console.log("arr Length: " + arr.length);
        return React.createElement(
          'div',
          { className: 'arr' },
          ' ',
          arr,
          ' '
        );
      } else return React.createElement(
        'h1',
        null,
        ' Loading '
      );
    }

  });

  var HeaderAndFrame = React.createClass({
    displayName: 'HeaderAndFrame',

    getInitialState: function getInitialState() {
      return { montlySort: true };
    },
    baseButtonHandler: function baseButtonHandler(e) {
      //console.log("e.currentTarget.dataset.id: " + e.currentTarget.dataset.id);
      var montlySortState = e.currentTarget.dataset.id == "montly" ? true : false;
      this.setState({ montlySort: montlySortState });
    },

    render: function render() {

      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: 'headerInfo' },
          React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
              'div',
              { className: 'col-xs-1' },
              '#'
            ),
            React.createElement(
              'div',
              { className: 'col-xs-5' },
              'Camper'
            ),
            React.createElement(
              'div',
              { className: 'col-xs-3', 'data-id': 'montly', onClick: this.baseButtonHandler },
              this.state.montlySort ? React.createElement('img', { src: 'https://cdn01.gitter.im/_s/1f043e7/images/emoji/cookie.png', alt: 'brownie-points', className: 'brownie' }) : null,
              'Montly',
              this.state.montlySort ? React.createElement('i', { className: 'fa fa-sort' }) : null
            ),
            React.createElement(
              'div',
              { className: 'col-xs-3', 'data-id': 'alltime', onClick: this.baseButtonHandler },
              !this.state.montlySort ? React.createElement('img', { src: 'https://cdn01.gitter.im/_s/1f043e7/images/emoji/cookie.png', alt: 'brownie-points', className: 'brownie' }) : null,
              'All time ',
              !this.state.montlySort ? React.createElement('i', { className: 'fa fa-sort' }) : null
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'users' },
          React.createElement(Frame, { montlySort: this.state.montlySort })
        )
      );
    }

  });

  ReactDOM.render(React.createElement(HeaderAndFrame, null), document.getElementById('content'));
});