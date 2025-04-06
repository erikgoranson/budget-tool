<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted, computed } from "vue";
import { MoreHorizontal } from 'lucide-vue-next';
import { ChevronLeft } from 'lucide-vue-next';
import { createReusableTemplate, useMediaQuery } from '@vueuse/core';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';
import { Switch } from '../components/ui/switch';
import HideVirtualKeyboard from "./HideVirtualKeyboard.vue";

const mainTab = 'actions'
const activeTab = ref(mainTab);

const setTab = (value: string) => {
    activeTab.value= value;
    console.log('activetab set to: ', activeTab.value)
};

const [DefineContent, UseContent] = createReusableTemplate();
const isDesktop = useMediaQuery('(min-width: 768px)');

</script>

<template>

<DefineContent as-child>
 
            <div class="w-full flex flex-row items-center justify-center semibold "> 
                <div class="flex-1" >
                    <div v-if="activeTab != mainTab" class="flex flex-row items-center" @click="setTab(mainTab)">
                        <ChevronLeft/> Back
                    </div>
                </div>
                <div v-if="activeTab != mainTab" class="capitalize">{{ activeTab }}</div>
                <div v-else class="capitalize">Category Actions</div>
                <div class="flex-1"></div>
            </div>
            <div >
                <!-- w-[400px] -->
                <Tabs v-model="activeTab" :default-value="activeTab" class="w-[300px]  wat" orientation="vertical">

                <TabsContent :value=mainTab class="mt-0">
                    <ul>
                        <li @click="setTab('edit')">edit this category</li>
                        <li @click="setTab('delete')">delete this category</li>
                        <li>does this category have a duedate? {TOGGLE}</li>
                    </ul>
                </TabsContent>
                <TabsContent value="edit">
                    


                    <form class="grid items-start gap-1 px-4">

<HideVirtualKeyboard />

<FormField v-slot="{ componentField }" name="name">
    <FormItem>
        <FormLabel></FormLabel>
        <FormControl>
            <Input type="text" placeholder="Category Name, i.e. 'Monthly Bills'"  />
        </FormControl>
        <FormDescription></FormDescription>
        <FormMessage />
    </FormItem>
</FormField>

<FormField v-slot="{ componentField, }" name="description">
    <FormItem>
        <FormLabel></FormLabel>
        <FormControl>
            <Input type="text" placeholder="Add a description" v-bind="componentField" />
        </FormControl>
        <FormDescription></FormDescription>
        <FormMessage />
    </FormItem>
</FormField>

<FormField v-slot="{ value, handleChange }" name="hasDueDates">
    <FormItem>
        <FormLabel></FormLabel>
        <FormControl>
            <div class="flex justify-center items-center space-x-2">
                <Switch 
                :checked="value"
                @update:checked="handleChange"/>
                <Label>Does this category have due dates?</Label>
            </div>
        </FormControl>
        <FormDescription></FormDescription>
        <FormMessage />
    </FormItem>
</FormField>

<Button type="submit" >Update</Button>
</form>

                </TabsContent>
                <TabsContent value="delete">
                    delete
                </TabsContent>
                <TabsContent value="dueDate">
                    delete
                </TabsContent>
                </Tabs>
            </div>
</DefineContent>

<!-- <p>
    active tab: {{ activeTab }}
</p> -->

<!-- <div class="flex flex-row mr-2 items-end justify-center"> -->
    <DropdownMenu v-if="isDesktop" >
        <DropdownMenuTrigger as-child>
            <Button @click="activeTab = mainTab">
                <span class="sr-only">Open menu</span>
                <MoreHorizontal class="h-4 w-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            
            <UseContent />
        </DropdownMenuContent>
    </DropdownMenu>

    <Drawer v-else="isDesktop">
        <DrawerTrigger as-child>
            <Button @click="activeTab = mainTab">
                <span class="sr-only">Open menu</span>
                <MoreHorizontal class="h-4 w-4" />
            </Button>
        </DrawerTrigger>
        <DrawerContent>
            <DrawerHeader>
                <DrawerTitle />
                <DrawerDescription />
            </DrawerHeader>

            <UseContent />

            <DrawerFooter>
                <!-- <Button>Submit</Button>
                <DrawerClose>
                <Button variant="outline">
                    Cancel
                </Button>
                </DrawerClose> -->
            </DrawerFooter>
        </DrawerContent>
    </Drawer>
<!-- </div> -->

</template>

<style>

.tab-content-transition {
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  opacity: 0;
  transform: translateX(20px);
}

.tab-content-transition.active {
  opacity: 1;
  transform: translateX(0);
}

</style>