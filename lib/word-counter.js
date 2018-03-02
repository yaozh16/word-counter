'use babel';

import WordCounterView from './word-counter-view';
import {
  CompositeDisposable
} from 'atom';

export default {

  wordCounterView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.wordCounterView = new WordCounterView(state.wordCounterViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.wordCounterView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'word-counter:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.wordCounterView.destroy();
  },

  serialize() {
    return {
      wordCounterViewState: this.wordCounterView.serialize()
    };
  },

  toggle() {
    if (this.modalPanel.isVisible()) {
      this.modalPanel.hide();
    } else {
      const editor = atom.workspace.getActiveTextEditor();
      const words = editor.getText().split(/\s+/).length;
      this.wordCounterView.setCount(words);
      this.modalPanel.show();
    }
  }

};