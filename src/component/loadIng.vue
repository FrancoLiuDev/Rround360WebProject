<style>
.load-ing {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background: #ffffff;
    z-index: 5000;
    .loader {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 60px;
        height: 60px;
        margin: 0px;
        border: 8px solid #f3f3f3;
        border-top: 8px solid #3498db;
        border-radius: 50%;
        animation: LoadMcSpin 2s linear infinite;
    }
    .message {
        position: absolute;
        left: 50%;
        bottom: 0px;
        transform: translate(-50%, 0px);
    }
}

@keyframes LoadMcSpin {
    0% {
        transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
        transform: translate(-50%, -50%) rotate(360deg);
    }
}
</style>
<template>
    <transition name="fadeOut">
        <div class="load-ing">
            <div class="loader"></div>
            <div class="message">
                <slot></slot>
            </div>
        </div>
    </transition>
</template>
