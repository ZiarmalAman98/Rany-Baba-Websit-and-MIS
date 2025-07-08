<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>ضامن چاپ</title>
    <!-- Tell the browser to be responsive to screen width -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Theme style -->
    <link rel="stylesheet" href="{{ asset('dist/css/adminlte.min.css') }}">
    <!-- iCheck -->
    <!-- bootstrap rtl -->
    <link rel="stylesheet" href="{{ asset('dist/css/bootstrap-rtl.min.css') }}">
    <!-- template rtl version -->
    <link rel="stylesheet" href="{{ asset('dist/css/custom-style.css') }}">

</head>

<style>
    body {
        margin: 0px;
        padding: 0px;
        background-color: #fafafa;

    }

    * {
        box-sizing: border-box;
        -moz-border-sizing: border-box;
    }

    .page {
        width: 21cm;
        min-height: 29.7cm;
        padding: 2cm;
        margin: 1cm auto;
        border: 1px #d3d3d3 solid;
        border-radius: 5px;
        background: white;
        box-shadow: 0 0 5px rgb(0, 0, 0, 0.1);

    }

    .subpage {
        padding: 1cm;
        border: 2px solid;
        height: 256mm;
        /* outline: 2cm #FFEAEA solid; */

    }

    @page {
        size: 8.5in 11in;
        margin: 0.25in;
    }

    @media print {
        .page {
            margin: 0;
            border: initial;
            border-radius: initial;
            box-shadow: initial;
            background: initial;
            page-break-after: always;
        }
    }
</style>

<body id="body">

    <div class="container">


        <div class="row">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 table-responsive  page">
                <style>
                    .printTable_info {
                        height: 1330px;
                        width: 900px;
                    }

                    #example tr th,
                    #example tr td {
                        text-align: center;
                    }
                </style>

                <div class="printTable ">
                    <table id="subpage" class="table table-condensed  subpage"
                        style="direction: ltr; font-family:sans-serif; font-size: 12px; text-align:center;">
                        @foreach ($select_owners as $print_owner)
                            <tr style="border: none;" dir="rtl">
                                <td colspan="5" class="text-right " style="border: none; vertical-align: middle;">
                                    <span style=" font-weight: bold;">تا &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {{ $print_owner->to_add }}
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;) </span>
                                    <hr style="margin: 0%; ">
                                </td>
                                <td colspan="5" class="text-right" style="border: none; vertical-align: middle;">
                                    <span style=" font-weight: bold;"> الی &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {{ $print_owner->from_add }}
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;) </span>
                                    <hr style="margin: 0%; ">
                                </td>
                                <td colspan="5" class="text-right" style="border: none; ">
                                    <span style=" font-weight: bold;">کــــوډ:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {{ $print_owner->direction_number }}
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;) </span>
                                    <hr style="margin: 0%; ">
                                </td>
                            </tr>
                            <tr>
                                <td colspan="22" style="border: 2px solid;"><span id="">دننـــګــرهار ولایت د
                                        راني بــابــا ترانســپورټي شــرکــت د ریکـــشي ضمــانت خــــط</span></td>
                            </tr>
                            <tr>

                                <td rowspan="2" style="border: 2px solid; height: 15px;"><span id="">د موټر
                                        مالک عکس</span></td>
                                <td rowspan="2" style="border: 2px solid; height: 15px;"><span id="">د کور
                                        نمبر</span></td>
                                <td rowspan="2" style="border: 2px solid; height: 15px;"><span id="">تلیفون
                                        نمبر</span></td>
                                <td colspan="3" style="border: 2px solid; height: 15px;"><span id="">فعلي
                                        استوګنځی</span></td>
                                <td colspan="3" style="border: 2px solid; height: 15px;"><span id="">اصلي
                                        هستوګنځی</span></td>
                                <td rowspan="2" style="border: 2px solid; height: 15px;"><span id="">دتذکیرې
                                        نمبر</span></td>
                                <td rowspan="2" style="border: 2px solid; height: 15px;"><span
                                        id="">وظېفه</span></td>
                                <td colspan="3" style="border: 2px solid; height: 15px;"><span id=""
                                        class="text-center">د ریکشي د مالک شهرت</span></td>
                            </tr>
                            <tr>
                                <td style="border: 2px solid; height: 15px;"><span>کلی</span></td>
                                <td style="border: 2px solid; height: 15px;"><span>ولسوالی</span></td>
                                <td style="border: 2px solid; height: 15px;"><span>ولایت</span></td>
                                <td style="border: 2px solid; height: 15px;"><span>کلی</span></td>
                                <td style="border: 2px solid; height: 15px;"><span>ولسوالی</span></td>
                                <td style="border: 2px solid; height: 15px;"><span>ولایت</span></td>
                                <td style="border: 2px solid; height: 15px;"><span>د نیکه نوم</span></td>
                                <td style="border: 2px solid; height: 15px;"><span>دپلارنوم</span></td>
                                <td style="border: 2px solid; height: 15px;"><span>نوم</span></td>
                            </tr>
                            <tr>

                                <td width="0" style="border: 2px solid;">
                                    <img src="{{ asset('upload/owner/image/' . $print_owner->image) }}"
                                        class="img img-responsive " height="50" width="50">
                                </td>
                                <td width="0" style="border: 2px solid;"><span
                                        id="">{{ $print_owner->house_no }}</span></td>
                                <td width="0" style="border: 2px solid;"><span
                                        id="">{{ $print_owner->phone_number }}</span></td>
                                <td width="0" style="border: 2px solid;"><span
                                        id="">{{ $print_owner->current_village }}</span></td>
                                <td width="0" style="border: 2px solid;"><span
                                        id="">{{ $print_owner->current_dist_name }}</span></td>
                                <td width="0" style="border: 2px solid;"><span
                                        id="">{{ $print_owner->current_pro_name }}</span></td>
                                <td width="0" style="border: 2px solid;"><span
                                        id="">{{ $print_owner->permenant_village }}</span></td>
                                <td width="0" style="border: 2px solid;"><span
                                        id="">{{ $print_owner->per_dist_name }}</span></td>
                                <td width="0" style="border: 2px solid;"><span
                                        id="">{{ $print_owner->per_provine_name }}</span></td>
                                <td width="0" style="border: 2px solid;"><span
                                        id="">{{ $print_owner->nic_number }}</span></td>
                                <td width="0" style="border: 2px solid;"><span
                                        id="">{{ $print_owner->owner_job }}</span></td>
                                <td width="0" style="border: 2px solid;"><span
                                        id="">{{ $print_owner->grand_fname }}</span></td>
                                <td width="0" style="border: 2px solid;"><span
                                        id="">{{ $print_owner->father_name }}</span></td>
                                <td width="0" style="border: 2px solid;"><span
                                        id="">{{ $print_owner->name . ' ' . $print_owner->last_name }}</span>
                                </td>
                            </tr>

                            <tr>
                                <td colspan="22" class="text-right" dir="rtl"
                                    style="font-size: 15px; font-weight: bold;">زه چې شــهرت مــې پورتـه زکر شوی، یو
                                    عـــراده ریکـــشه چې پلیــت نمبـــر ( {{ $print_owner->plate_no }}) چې اوسمهـــال
                                    زما په واک او خیتــیار کې قرار لري.</td>
                            </tr>
                            <tr style="border: none;">
                                <td colspan="22" class="text-right" dir="rtl"
                                    style="font-size: 15px; font-weight: bold;">د هېواد د نافذه قوانینو مطابق به
                                    اجـــرات کوم.
                                    د نوموړي واسطي اړوند هر مشکل د لرلو په صورت کې د راني بابا د ریکشو ترانســپورټي شرکت
                                    او یا بلي هري دولتي اداري ته حاضریږم. زه په خپل اقرار او وعده رښتېنی یم.
                                </td>
                            </tr>
                            <tr style="border: none;">
                                <td colspan="22" class="text-center"><span
                                        style="font-size: 15px; font-weight: bold;">&nbsp;(&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)&nbsp;</span><span
                                        style="font-size: 15px; font-weight: bold;">د واسطي د مالک لاسلیک / د ګوتې نښه
                                    </span></td>
                            </tr>
                        @endforeach

                        @if (!empty($get_sponser_one))


                            <td style="border: 2px solid;" colspan="22">د لومړي ضمانت کوونکي شهرت</td>
                            </tr>
                            <tr>
                                <td rowspan="2" style="border: 2px solid;">د ضمانت کوونکي عکس </td>
                                <td rowspan="2" colspan="4" style="border: 2px solid;">د تضمین کوونکي مامور د
                                    برحالۍ تایید د مربوطه دولتي مرجع څخه </td>
                                <td rowspan="2" style="border: 2px solid;">د تلیفون شمیره</td>
                                <td colspan="3" style="border: 2px solid;">فعلي استوګنځی</td>
                                <td colspan="3" style="border: 2px solid;">اصلي استوګنځی</td>
                                <td colspan="2" style="border: 2px solid;">د ضامن شهرت</td>
                            </tr>
                            <tr>
                                <td style="border: 2px solid;">قریه</td>
                                <td style="border: 2px solid;">ولسوالي</td>
                                <td style="border: 2px solid;">ولایت</td>
                                <td style="border: 2px solid;">قریه</td>
                                <td style="border: 2px solid;">ولسوالي</td>
                                <td style="border: 2px solid;">ولایت</td>
                                <td style="border: 2px solid;">د پلار نوم</td>
                                <td style="border: 2px solid;">نو م</td>
                            </tr>

                            <tr>
                                <td width="0" style="border: 2px solid;">
                                    <img src="{{ asset('upload/sponsor/' . $get_sponser_one->image_one) }}"
                                        class="img img-responsive" height="50" width="50">
                                </td>

                                <td width="0" colspan="4" style="border: 2px solid;"><span
                                        id="">{{ $get_sponser_one->approval_barharli }}</span></td>
                                <td width="0" style="border: 2px solid;"><span
                                        id="">{{ $get_sponser_one->phone_number }}</span></td>
                                <td width="0" style="border: 2px solid;"><span
                                        id="">{{ $get_sponser_one->cur_village }}</span></td>
                                <td width="0" style="border: 2px solid;"><span
                                        id="">{{ $get_sponser_one->current_dist_name }}</span></td>
                                <td width="0" style="border: 2px solid;"><span
                                        id="">{{ $get_sponser_one->current_pro_name }}</span></td>
                                <td width="0" style="border: 2px solid;"><span
                                        id="">{{ $get_sponser_one->per_village }}</span></td>
                                <td width="0" style="border: 2px solid;"><span
                                        id="">{{ $get_sponser_one->per_dist_name }}</span></td>
                                <td width="0" style="border: 2px solid;"><span
                                        id="">{{ $get_sponser_one->per_provine_name }}</span></td>
                                <td width="0" style="border: 2px solid;"><span
                                        id="">{{ $get_sponser_one->sponsor_fname }}</span></td>
                                <td width="0" style="border: 2px solid;"><span
                                        id="">{{ $get_sponser_one->sponser_name }}</span></td>
                            </tr>

                            <tr>
                                <td colspan="22" class="text-right" dir="rtl"
                                    style="font-size: 15px; font-weight: bold;">نوموړی د ریکـشي مالک چې فورمي کې یې
                                    تعارف شوی ، زه یې کاملاً پېژنم. هر وخت که د راني بابا د ریکــشو ترانســپورټي
                                    شرکت او یا بلي دولتي اداري ته د ضرورت په وخت کې حاضرېږم. د ریکشي د خرڅولو په صورت کې
                                    به مربوط اداري ته خبر ورکوم. په احترام
                                </td>
                            </tr>
                            <tr style="border: none;">
                                <td colspan="22" class="text-center"><span
                                        style="font-size: 15px; font-weight: bold;">&nbsp;(&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)&nbsp;</span><span
                                        style="font-size: 15px; font-weight: bold;">د تضمین کوونکي لاسلیک / د ګوتې نښه
                                    </span></td>
                            </tr>


                            <tr>
                                <td style="border: 2px solid;" colspan="22">د دوهم ضمانت کوونکي شهرت</td>
                            </tr>
                            <tr>
                                <td rowspan="2" style="border: 2px solid;">د ضمانت کوونکي عکس </td>
                                <td rowspan="2" colspan="4" style="border: 2px solid;">د تضمین کوونکي مامور د
                                    برحالۍ تایید د مربوطه دولتي مرجع څخه </td>
                                <td rowspan="2" style="border: 2px solid;">د تلیفون شمیره</td>
                                <td colspan="3" style="border: 2px solid;">فعلي استوګنځی</td>
                                <td colspan="3" style="border: 2px solid;">اصلي استوګنځی</td>
                                <td colspan="2" style="border: 2px solid;">د ضامن شهرت</td>
                            </tr>
                            <tr>
                                <td style="border: 2px solid;">قریه</td>
                                <td style="border: 2px solid;">ولسوالي</td>
                                <td style="border: 2px solid;">ولایت</td>
                                <td style="border: 2px solid;">قریه</td>
                                <td style="border: 2px solid;">ولسوالي</td>
                                <td style="border: 2px solid;">ولایت</td>
                                <td style="border: 2px solid;">د پلار نوم</td>
                                <td style="border: 2px solid;">نو م</td>
                            </tr>



                            @if ($get_sponser_one->phone_number != $get_sponser_two->phone_number)
                                <tr>
                                    <td width="0" style="border: 2px solid;">
                                        <img src="{{ asset('upload/sponsor/' . $get_sponser_two->image_two) }}"
                                            class="img img-responsive " height="50" width="50">
                                    </td>
                                    </span></td>
                                    <td width="0" colspan="4" style="border: 2px solid;"><span
                                            id="">{{ $get_sponser_two->approval_barharli }}</span></td>
                                    <td width="0" style="border: 2px solid;"><span
                                            id="">{{ $get_sponser_two->phone_number }}</span></td>
                                    <td width="0" style="border: 2px solid;"><span
                                            id="">{{ $get_sponser_two->cur_village }}</span></td>
                                    <td width="0" style="border: 2px solid;"><span
                                            id="">{{ $get_sponser_two->current_dist_name }}</span></td>
                                    <td width="0" style="border: 2px solid;"><span
                                            id="">{{ $get_sponser_two->current_pro_name }}</span></td>
                                    <td width="0" style="border: 2px solid;"><span
                                            id="">{{ $get_sponser_two->per_village }}</span></td>
                                    <td width="0" style="border: 2px solid;"><span
                                            id="">{{ $get_sponser_two->per_dist_name }}</span></td>
                                    <td width="0" style="border: 2px solid;"><span
                                            id="">{{ $get_sponser_two->per_provine_name }}</span></td>
                                    <td width="0" style="border: 2px solid;"><span
                                            id="">{{ $get_sponser_two->sponsor_fname }}</span></td>
                                    <td width="0" style="border: 2px solid;"><span
                                            id="">{{ $get_sponser_two->sponser_name }}</span></td>
                                </tr>
                                <tr>
                                    <td colspan="22" class="text-right" dir="rtl"
                                        style="font-size: 15px; font-weight: bold;">نوموړی د ریکـشي مالک چې فورمي کې یې
                                        تعارف شوی ، زه یې کاملاً پېژنم. هر وخت که د راني بابا د ریکــشو ترانســپورټي
                                        شرکت او یا بلي دولتي اداري ته د ضرورت په وخت کې حاضرېږم. د ریکشي د خرڅولو په
                                        صورت کې به مربوط اداري ته خبر ورکوم. په احترام
                                    </td>
                                </tr>
                                <tr style="border: none;">
                                    <td colspan="22" class="text-center"><span
                                            style="font-size: 15px; font-weight: bold;">&nbsp;(&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)&nbsp;</span><span
                                            style="font-size: 15px; font-weight: bold;">د تضمین کوونکي لاسلیک / د ګوتې
                                            نښه </span></td>
                                </tr>
                            @else
                            @endif
                        @else
                            <tr>
                                <td colspan="22">
                                    <h1 style="color: red; " dir="rtl">د نوموړي مالک ضامنین شتون نلري !</h1>
                                </td>
                            </tr>
                        @endif
                    </table>
                </div>

                <button type="button" class="btn btn-sm btn-primary" id="print">فورمي چاپ</button>
                <a href="{{ route('owner.index') }}" class="btn btn-sm btn-danger">واپس</a>
            </div>

        </div>



    </div>



    <!-- jQuery -->
    <script src="{{ asset('plugins/jquery/jquery.min.js') }}"></script>


    <script src="{{ asset('js/jquery.PrintArea.js') }}"></script>



    <script>
        $(document).ready(function() {
            $("#print").click(function() {
                var mode = 'iframe';
                var close = mode == 'popup';
                var options = {
                    mode: mode,
                    popClose: close
                };
                $('div.printTable').printArea(options);
            });
        });
    </script>


</body>

</html>
