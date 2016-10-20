<template>
  <div class="btn-addkol" @click.prevent="openModal">
    <span class="glyphicon glyphicon-plus"></span>
  </div>
  <div class="m-kol modal fade" :class="{ in: openModalClass}">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true" @click.prevent="hideModal">&times;</span></button>
          <h4 class="modal-title">添加新的达人</h4>
        </div>
        <div class="modal-body">
          <form>
            <div class="form-group">
              <label for="kol-title" class="control-label">名字：</label>
              <input type="text" class="form-control" id="kol-title" placeholder="单行输入" v-model="dataList.title">
            </div>
            <div class="form-group">
              <label for="content-text" class="control-label">内容:</label>
              <textarea class="form-control" id="content-text" v-model="dataList.content" placeholder="输入内容"></textarea>
            </div>
            <div class="form-group classify">
              <label class="control-label">领域分类：</label>
              <select v-model="dataList.selected" class="form-control">
                <option v-for="option of options" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label class="control-label">社交平台：</label>
              <input v-for="website of dataList.websites" type="text" class="form-control website" track-by="$index" id="kol-website{{ $index }}" placeholder="例如：https://github.com/treedom0/TD" v-model="dataList.websites[ $index ]">
              <div class="btn-add-website" @click="addWebsite">
                <span class="glyphicon glyphicon-plus"></span>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click.stop="submitMsg">提交</button>
        </div>
      </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
  </div><!-- /.modal -->
</template>

<script lang="babel">

export default {
  name: 'addKol',

  props: ['backdropOpen','transitionClass'],

  data () {

    return {
      options: [
        { text: '摄影', value: 'shoot' },
        { text: '家居', value: 'home' },
        { text: '汽车', value: 'car' },
        { text: '吃喝', value: 'eat' },
        { text: '数码', value: 'digital' },
        { text: '穿戴', value: 'clothing' }
      ],
      dataList: {
        content: '',
        title: '',
        selected: 'shoot',
        websites: [''],
      },
      openModalClass: false,
    }

  },

  methods: {

    openModal () {

      //const _that = this;

      this.backdropOpen = true;

      let modalEl  = document.querySelector('.m-kol');

      modalEl.style.display = 'block';

      setTimeout(() => {

        this.transitionClass = true;
        this.openModalClass = true;

      },50);
    },

    hideModal () {


      this.openModalClass = false;
      this.transitionClass = false;

      let modalEl  = document.querySelector('.m-kol');

      setTimeout(() => {

        this.backdropOpen = false;

        modalEl.style.display = 'none';

      },150);

      this.dataList = {
        title: '',
        selected: 'shoot',
        websites: ['']
      }

    },

    addWebsite () {
      this.dataList.websites.push('');
    },

    submitMsg () {

      //const _that = this;

      let postData = {
        classifyName: this.dataList.selected,
        title: this.dataList.title,
        websiteURL: this.dataList.websites,
        content: this.dataList.content
      }

      this.$http.post('http://localhost:3030/ajax/addKOL', postData, {
        emulateJSON: true
      }).then( (res) => {

        console.log(res);

        this.dataList = {
          title: '',
          selected: 'shoot',
          websites: ['']
        }

        return alert(res.data.msg);

      }, (error) => {

        console.log(error);

      });

    }

  }

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: #42b983;
}
.btn-addkol {
  position: fixed;
  right: 0;
  bottom: 30px;
  width: 50px;
  height: 50px;
  background: #f9f9f9;
  text-align: center;
  cursor: pointer;
}
.btn-addkol .glyphicon.glyphicon-plus {
  margin-top: 10px;
  font-size: 24px;
}
.m-kol .form-group {
  position: relative;
}
.m-kol .form-group input {
  width: 95%;
}
.m-kol .classify label {
  display: block;
}
.m-kol .classify select {
  width: 30%;
}
.m-kol .form-group .website {
  margin-top: 15px;
}
.m-kol .form-group input.website:nth-of-type(1) {
  margin-top: 0;
}
.btn-add-website {
  position: absolute;
  bottom: 0;
  left: 95%;
  margin-left: 10px;
}
.btn-add-website .glyphicon.glyphicon-plus {
  font-size: 24px;
}
</style>
