import React, { PropTypes } from 'react'
import $ from 'jquery'

import '../associations-widget/associations-widget.css';

// бинд юзер

export default class Associations extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      where: props.where,
      name: 'Associations',
      description: 'Enter a word and get associations',
      word: null,
      words: null,
      pos: 0
    }

    this.getWords = this.getWords.bind(this)
    this.nextWord = this.nextWord.bind(this)
    this.getCatalogInfo = this.getCatalogInfo.bind(this)

    if (this.getCatalogInfo) {
      this.getCatalogInfo();
    }

    this.userId = 0

    const tthis = this

    chrome.storage.sync.get(['userId'], function(result) {
      this.userId = result.userId
      console.log("retrieveng text")

      $.ajax({
        method: "POST",
        url: "http://localhost:3000/associations/handleText",
        dataType: "json",
        data: {
          userId: this.userId
        }
      })
      .done(function(data) {
        let word = data["word"]
        if (word != null)
        {
          let words = data["words"].split(', ')
          $("#word").attr('placeholder', word)
          $("#resultAssociations").text(words[0])
          tthis.setState({
            ...tthis.state,
            word: word,
            words: words
          })
          tthis.props.resizeWidgets()
        }
      });
    });
  }

// готово
  getWords() {
    const tthis = this
    let word = document.getElementById("word").value
    let key = '79187b09-0830-4e0e-9087-99a6711502c8'
    let url = "https://api.wordassociations.net/associations/v1.0/json/search?apikey=" + key + "&lang=en" + "&text=" + word + "&type=response&limit=300&pos=noun"
    $.ajax({
      method: "GET",
      url: url,
      dataType: "json"
    })
    .done(function(data) {
      let words = data['response'][0]['items']
      let words2 = new Array(words.length)
      let p = 0
      Object.values(words).map(x => {
        words2[p] = x.item
        p = p + 1
      })
      tthis.setState({
        ...tthis.state,
        word: words[0]['item'],
        words: words2,
        pos: 0
      })
      $("#resultAssociations").text(tthis.state.words[tthis.state.pos])
      let paragraph = ''
      for (let w of words2) {
        paragraph = paragraph + w + ', '
      }
      tthis.props.resizeWidgets()
      $.ajax({
        method: "POST",
        url: "http://localhost:3000/associations/handleText",
        dataType: "json",
        data: {
          userId: userId,
          word: document.getElementById("word").value,
          words: paragraph,
        }
      })
    })
  }

  nextWord() {
    this.setState({
      ...this.state,
      pos: this.state.pos + 1
    }, () => {
      $("#resultAssociations").text(this.state.words[this.state.pos])
    })
  }

  getCatalogInfo() {
    console.log('sending info')
    return ({
      name: this.state.name,
      description: this.state.description,
      bind: this.bindUser
    })
  }

  render() {
    const { updateBind, data } = this.props
    let rmBtnClass = ""
    let addBtnClass = ""
    if (data !== undefined) {
      rmBtnClass = data.editable ? "removeButton is-active" : "removeButton"
      addBtnClass = data.isBinded ? "addButton disabled" : "addButton enabled"
    }
    return (
     this.state.where == 'catalog' ?
     (
      <div className="catalogEntry">
        <h2>{this.state.name}</h2>
        <p>{this.state.description}</p>
        <button className={addBtnClass} disabled={data.isBinded} onClick={() => updateBind(true, 'Association')} />
      </div>
    ) :
    (
    //  <div className="widgetsGrid">


    <div className="widgetWrapper">

      <div className="widget Associations">
        <h1>{this.state.name}</h1>

          <button
            className={rmBtnClass}
            type="button"
            id="addAssociationsWidget"
            onClick={() => updateBind(false, 'Association')}
          />

          <h2
            className="associationsDescription"
          >
            Click the word to get the next one
          </h2>

        <input
          id="word"
          type="text"
          placeholder="Input a word"
          pattern="^#[a-zA-Z]$"
        />



        <button
          className="sendButton"
          type="button"
          onClick={ this.getWords }>send</button>
        <div
          id="pd"
          onClick={this.nextWord}
        >
          <p
            id="resultAssociations">
          </p>
        </div>
      </div>
      </div>
    )
    //  </div>
    )
  }
}
