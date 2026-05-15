<script setup lang="ts">
import CreateTransactionDialog from './transaction/CreateTransactionDialog.vue';
import SidebarToggle from './SidebarToggle.vue';
import { CircleDollarSign, Wallet, GoalIcon, } from 'lucide-vue-next';
</script>

<template>
    <footer class="flex items-center justify-center px-4 pb-4 bg-indigo-200 border-t border-gray-200 pt-[env(keyboard-inset-height)] lg:hidden">
        <div class="flex-1 items-center justify-center mx-2">
            <div class="flex ml-auto items-center justify-between items-center flex space-x-4 mt-4">
                <router-link to="/" class="footNavItem">
                    <Wallet class="footerSvg" />
                    Budget
                </router-link>
                <router-link to="/transactions" class="footNavItem">
                    <CircleDollarSign class="footerSvg" />
                    <span>Transaction</span>
                </router-link>
                <span class="footNavItem pb-2">
                    <CreateTransactionDialog />
                </span>
                <router-link to="/goals" class="footNavItem">
                    <GoalIcon class="footerSvg" />
                    Goals
                </router-link>
                <span class="footNavItem">
                    <SidebarToggle />
                    Menu
                </span>
            </div>
        </div>
    </footer>
</template>

<style scoped>

.footerSvg {
    @apply [&_svg]:size-6 rounded-full h-8 w-8;
}

.footNavItem {
    @apply flex flex-col w-1/5 text-xs gap-1 items-center;
}

</style>