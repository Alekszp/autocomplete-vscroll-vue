<template>
  <div class="autocomplete">
    <input class="autocomplete-input" type="text" :value="text" @input="onInput" />
    <div class="autocomplete-controls">
      <i class="autocomplete-controls-clear-icon" @click="clear">❌</i>
      <i class="autocomplete-controls-expand-icon" @click="expanded = !expanded">🔽</i>
    </div>
    <div v-if="expanded" class="autocomplete-menu" ref="menu" @scroll="calculateCurrentSearchingResult">
      <div :style="{height: `${viewportHeight}px`}">
        <div
          v-for="(item, index) in currentSearchResult"
          :key="index"
          class="autocomplete-menu-item"
          :class="{selected: item.value === selectedItem.value}"
          @click="selectItem(item)"
          :style="{willChange: 'transform', transform: `translateY(${offsetY}px)`}"
        >
          <img v-if="avatar" :src="item.avatar" class="autocomplete-menu-item-avatar" />
          <div class="autocomplete-menu-item-text">{{item.text}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Autocomplete",
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    selected: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      expanded: false,
      selectedItem: {
        value: "",
        text: "",
        avatar: "",
      },
      searchResult: [],
      text: "",
      offsetY: 0,
      itemHeight: 33,
      currentSearchResult: [],
    };
  },
  computed: {
    viewportHeight() {
      return this.searchResult.length * this.itemHeight;
    },
  },
  
  methods: {
    cloneCollection(collection) {
      return JSON.parse(JSON.stringify(collection));
    },
    onInput(e) {
      let text = e.target.value.trim().toLowerCase();
      this.text = e.target.value;
      if (text) {
        this.searchResult = this.cloneCollection(this.items);
        this.searchResult = this.searchResult.filter((i) => {
          return i.text.toLowerCase().includes(text);
        });
        this.calculateCurrentSearchingResult(e);
      } else {
        this.searchResult = this.cloneCollection(this.items);
      }
      this.expanded = true;
    },
    calculateCurrentSearchingResult(e) {
      let startNode = Math.floor(e.target.scrollTop / this.itemHeight);
      this.offsetY = startNode * this.itemHeight;
      let begin = this.offsetY / this.itemHeight;
      this.currentSearchResult = this.searchResult.slice(begin, begin + 10);
    },
    selectItem(item) {
      this.selectedItem = item;
      this.emitData()
      this.text = this.selectedItem.text;
      this.expanded = false;
      this.searchResult = this.searchResult.filter((i) => {
        return i.text.toLowerCase().includes(item.text.toLowerCase());
      });
      this.currentSearchResult = this.cloneCollection(this.searchResult);
    },
    clear() {
      this.selectedItem.value = "";
      this.selectedItem.text = "";
      this.selectedItem.avatar = "";
      this.emitData()
      this.text = "";
      this.expanded = false;

      this.searchResult = this.cloneCollection(this.items);
      this.currentSearchResult = this.cloneCollection(this.items).slice(0, 10);
    },
    movingKeybardActions(sign){
      let index = this.searchResult.findIndex((i) => i.value === this.selectedItem.value);
      if(sign === '+' && index >= this.searchResult.length - 1) return
      if(sign === '-' && index === 0) return
      this.selectedItem = this.searchResult.find((i, idx) => sign === '+' ? idx === index + 1 : idx === index - 1);
      this.emitData()
      this.text = this.selectedItem.text;
      let menu = this.$refs.menu
      menu.scrollTop = sign === '+' ? this.itemHeight*index : -this.itemHeight*index;
    },
    emitData(){
      this.$emit('selected', this.selectedItem)
    }
  },

  created() {
    if (this.selected) {
      let val = this.items[0].value;
      let text = this.items[0].text;
      let avatar = this.items[0].avatar;
      this.text = this.items[0].text;
      this.selectedItem.value = val;
      this.selectedItem.text = text;
      this.selectedItem.avatar = avatar;
      this.emitData()
      this.searchResult = this.cloneCollection(this.items);
      this.currentSearchResult = this.cloneCollection(this.items).slice(0, 10);
     
      document.onkeydown = (evt) => {
        evt = evt || window.event;
        if (evt.keyCode === 40 && this.expanded) {
          //down
          this.movingKeybardActions('+')
        }
        if (evt.keyCode === 38 && this.expanded) {
          //up
          this.movingKeybardActions('-')
        }
        if (evt.keyCode === 13 && this.expanded) {
          this.expanded = false
        }
      };
    }
  },
};
</script>

<style scoped>
.autocomplete {
  position: relative;
}
.autocomplete-input {
  width: 300px;
  height: 30px;
  border-radius: 30px;
  border: 2px solid grey;
  outline: none;
  padding: 0 50px 1px 10px;
  box-shadow: none;
  color: gray;
  font-weight: 700;
}
.autocomplete-avatar-selected {
  position: absolute;
  top: 4px;
  left: 5px;
}
.autocomplete-avatar-selected img,
.autocomplete-menu-item-avatar {
  width: 25px;
  height: 25px;
  border: 1px solid grey;
  border-radius: 50%;
}
.autocomplete-controls {
  position: absolute;
  right: 10px;
  top: 6px;
}
.autocomplete-controls i {
  font-style: normal;
  cursor: pointer;
}
.autocomplete-menu {
  position: absolute;
  z-index: 8;
  height: 300px;
  width: 365px;
  overflow-y: auto;
  -webkit-box-shadow: 0px 10px 25px 2px rgba(148, 143, 148, 1);
  -moz-box-shadow: 0px 10px 25px 2px rgba(148, 143, 148, 1);
  box-shadow: 0px 10px 25px 2px rgba(148, 143, 148, 1);
}
.autocomplete-menu-item {
  display: flex;
  align-items: center;
  padding: 3px 5px;
}
.autocomplete-menu-item:hover {
  background-color: lightgray;
}
.autocomplete-menu-item-text {
  margin-left: 5px;
}
.selected {
  background-color: lightskyblue;
}
</style>
