import { defineStore } from 'pinia';
import { ref } from 'vue';
import { SetupStoreId } from '@/enum';
import { localStg } from '@/utils/storage';

export const userDetailStore = defineStore(SetupStoreId.UserDetail, () => {

    const detail = ref({})

    const setDataDetail = (item: object) => {
        detail.value = { ...item }
        localStg.set(SetupStoreId.UserDetail,detail.value)
        console.log(localStg.get(SetupStoreId.UserDetail))
    }

    const getDataDetail = () => {
        return detail.value || localStg.get(SetupStoreId.UserDetail)
    }

    return { setDataDetail, getDataDetail };
})