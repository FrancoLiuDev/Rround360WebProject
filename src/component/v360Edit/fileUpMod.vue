<style>
#fileUpMod {
    position: relative;
    input {
        display: none;
    }
    .file-bk {
        display: block;
        width: 200px;
        height: 200px;
        background-size: cover;
        background-position: center center;
        border: dashed 2px #000000;
        border-radius: 5px;
        line-height: 200px;
        text-align: center;
        font-size: 24px;
    }
    .alert {
        position: absolute;
        left: 0px;
        bottom: 0px;
        width: 200px;
    }
}
</style>
<template>
    <div id="fileUpMod">
        <label class="file-bk" @dragover.prevent @drop.prevent="drop " :style="{ backgroundImage: 'url(' + preview + ')' }">{{contTxt}}
            <input type="file" @change="fileChange" accept="image/png" />
        </label>
        <transition name="fade">
            <div class="alert alert-danger" v-show="message!==''">{{message}}</div>
        </transition>
    </div>
</template>
<script>
export default {
    data: function() {
        return {
            /* 空白 */
            blank: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
            imageData: '',
            file: null,
            message: '',
        }
    },
    components: {},
    computed: {
        preview() {
            return this.imageData ? this.imageData : this.blank
        },
        contTxt() {
            return this.imageData ? '' : this.$t('fileUpMod.cont')
        }
    },
    methods: {
        drop(e) {
            this.filePreview(e.dataTransfer.files[0])
        },
        fileChange(e) {
            this.filePreview(e.target.files[0])
        },
        filePreview(file) {
            if (file && file.type === 'image/png') {
                this.file = file
                let fr = new FileReader();
                fr.onload = (e) => this.imageData = e.target.result;
                fr.readAsDataURL(file);
            } else {
                this.$emit('message', this.$t('fileUpMod.err'))
            }
        },
    },
    mounted() {
        let t;
        this.$on('message', (mes) => {
            clearTimeout(t)
            this.message = mes
            t = setTimeout(() => {
                this.message = ''
            }, 4000)
        })
    }
}
</script>
