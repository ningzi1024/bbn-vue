<template>
    <div class="export-excel" @click="exportExcel2">{{ $t('STATION.OUT_EXCEL') }}</div>
</template>

<script>
    import FileSaver from 'file-saver'
    import XLSX from 'xlsx'
    export default {
        props: {
            id: {
                type: String,
                default: 'Table'
            },
            name: {
                type: String,
                default: 'Table'
            }

        },
        data () {
            return {}
        },
        components: {
        },
        methods: {
            // 导出Excel表格
            exportExcel () {
                var xlsxParam = { raw: true }
                var wb = XLSX.utils.table_to_book(
                    document.querySelector('#' + this.id),
                    xlsxParam
                )
                var wbout = XLSX.write(wb, {
                    bookType: 'xlsx',
                    bookSST: true,
                    type: 'array'
                })
                try {
                    FileSaver.saveAs(
                        new Blob([wbout], {
                            type: 'application/octet-stream'
                        }),
                        this.name + '.xlsx'
                    )
                } catch (e) {
                    if (typeof console !== 'undefined') console.log(e, wbout)
                }
                return wbout
            },
            exportExcel2(){
                var xlsxParam = { raw: true }
                var wb = XLSX.utils.table_to_book(
                    document.querySelector('#' + this.id),
                    xlsxParam
                )
                var wbout = XLSX.write(wb, {
                    bookType: 'xlsx',
                    bookSST: false,
                    type: 'array'
                })
                try {
                    FileSaver.saveAs(
                        new Blob([wbout], {
                            type: 'application/octet-stream'
                        }),
                        this.name + '.xlsx'
                    )
                } catch (e) {
                    if (typeof console !== 'undefined') console.log(e, wbout)
                }
                return wbout
            }
        }
    }
</script>

<style lang="stylus">
.export-excel
    display inline-block
    color #428bca !important
    background url("../assets/images/excel-output.png") no-repeat 0
    background-size auto 100%
    padding 0 0 0 0.3rem
    margin 0.1rem 0.27rem
    cursor pointer
</style>