<template>
    <div class="modal-mask" @click.self="close" v-if="visible">
      <transition
      :duration="588"
      appear
      enter-active-class="animated bounceIn"
      leave-active-class="animated bounceOut"
      >
      <div class="modal-container">
        <div class="modal-title">
            {{title}}
        </div>
        <div class="modal-body">
          <slot name="content"></slot>
        </div>
        <div class="modal-footer">
          <a @click.self="close" class="modal-btn modal-btn-color-blue">确定</a>
        </div>
      </div>
      </transition>
    </div>
</template>

<script>
export default {
  name: 'ModalTip',
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true
    },
    title: {
      type: String,
      default: ''
    }
  },
  mounted () {
    document.body.appendChild(this.$el)
  },
  methods: {
    close () {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="stylus" scoped>
    .modal-mask
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      z-index: 1000;
      display: flex;
      justify-content: center;
      align-items: center;
      .modal-container
        background: #fff;
        width: 86%;
        border-radius: 0.08rem;
        .modal-title
          box-sizing: border-box;
          font-size: 0.3rem;
          text-align: center;
          height: 0.8rem;
          line-height: 0.8rem;
          border-bottom: 0.01rem solid #ddd;
        .modal-body
          box-sizing: border-box;
          font-size: 0.3rem;
          line-height: 0.5rem;
          text-indent: .6rem;
          font-size: .28rem;
          text-align: justify;
          max-height: 5rem;
          overflow-y: scroll;
        .modal-footer
          box-sizing: border-box;
          height: 0.7rem;
          display: flex;
          align-items: center;
          .modal-btn
            display: block;
            height: 0.7rem;
            line-height: .7rem;
            font-size: 0.2rem;
            width: 100%;
            border-bottom-right-radius: 0.08rem;
            border-bottom-left-radius: 0.08rem;
            &.modal-btn-color-blue
              display: block;
              background-color: #00a0e9;
              text-align: center;
              color: #fff;
              font-size: 0.36rem;
</style>
