<style>
.v360-list-item {
    &.mouse_bn {
        &:hover {
            filter: brightness(0.9);
        }
    }
    .right {
        float: right;
    }
}
</style>
<template>
    <transition name="fade">
        <li class="list-group-item v360-list-item" :class="liStyle" @click="openViewer">
            <span class="glyphicon" :class="glyphicon" aria-hidden="true">
                {{itemdata.name}} {{stateString}}
            </span>
            <span class="glyphicon glyphicon-trash right mouse_bn" aria-hidden="true" @click.stop="clickDel">
            </span>
        </li>
    </transition>
</template>
<script>
export default {
    data: function() {
        return {

        }
    },
    props: ['itemdata'],
    computed: {
        stateString() {
            switch (this.itemdata.status) {
                case 0:
                    return this.$t('v360List.status[0]')
                    break
                case 1:
                    return this.$t('v360List.status[1]')
                    break
                case 2:
                    return this.$t('v360List.status[2]')
                    break
                default:
                    return this.$t('v360List.status[3]')
            }
        },
        glyphicon() {
            switch (this.itemdata.status) {
                case 0:
                    return 'glyphicon-ok'
                    break
                case 1:
                    return 'glyphicon-remove'
                    break
                case 2:
                    return 'glyphicon-refresh'
                    break
                default:
                    return ''
            }
        },
        liStyle() {
            switch (this.itemdata.status) {
                case 0:
                    return 'list-group-item-success mouse_bn'
                    break
                case 1:
                    return 'list-group-item-warning'
                    break
                case 2:
                    return ''
                    break
                default:
                    return ''
            }
        },
    },
    methods: {
        openViewer() {
            if (this.itemdata.status === 0) {
                this.$emit('v360view', this.itemdata.mp4key)
            }
        },
        clickDel() {
            this.$emit('delV360', this.itemdata.mp4key)
        },
    }
}
</script>
