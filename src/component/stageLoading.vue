<style>
#stageLoading {
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background: #ffffff;
    z-index: 9999;
    .loader {
        border: 16px solid #f3f3f3;
        border-top: 16px solid #3498db;
        border-radius: 50%;
        width: 120px;
        height: 120px;
        animation: stageLoadingSpin 2s linear infinite;
        margin: 200px auto;
    }
}

@keyframes stageLoadingSpin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
<template>
    <transition name="fadeOut">
        <div id="stageLoading">
            <div class="loader"></div>
        </div>
    </transition>
</template>
<script>
export default {

}
</script>
