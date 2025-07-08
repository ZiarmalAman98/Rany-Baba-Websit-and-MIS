@extends('layouts.app')
@section('title', 'د ضامن معلومات تغیرول')
@section('content')
    <br>
    <!-- Main content -->
    <section class="content" style="font-family: Bahij Zar;">
        <div class="container-fluid">

            <div class="card" style="border-radius: 0px;;">
                <div class="row" style="margin-top:20px;">

                    <div class="col-lg-6" style="text-align: right;">
                        <h5 style="font-family: Bahij Titra; margin-right: 30px;">شرکت ترانســـــــپورټي ریکـــــشه راني
                            بـابـا </h5>
                    </div>
                    <div class="col-lg-6  text-left">
                        <span id="time" style="margin-left:10px;"></span>
                        <script>
                            window.setInterval(ut, 1000);

                            function ut() {
                                var d = new Date();
                                document.getElementById("time").innerHTML = d.toLocaleTimeString();
                            }
                        </script>
                    </div>

                </div>

                <div class="card card-header" style="background-color: lightgray; border-radius:0px;">
                    <h5 style="text-align: center;"> د ضامن معلومات تغیرول </h5>
                </div>
                <div id="std_card_body" class="card-body" style="text-align:right;">
                    <form id="std_reg" method="post" action="{{ route('sponser.update', $edit_sponsor) }}"
                        enctype="multipart/form-data" dir="rtl">
                        @csrf
                        @method('PUT')
                        <h4 class="text-center">د مالک شهرت</h4>
                        <div class="row">
                            <div class="col-lg-1">
                            </div>
                            <div class="col-lg-5 col-md-6 col-sm-12 col-xs-12 pull-right">
                                <div class="form-group form-group-sm">
                                    <label for="owner_code">د مالک کوډ<span style="color: red"> * </span></label>
                                    <input type="text" class="form-control text-right"
                                        value="{{ $edit_sponsor->owner_id }}" id="owner_code" name="owner_code"
                                        required="required" pattern="[0-9]*[۰-۹]*" title="یوازې نمبر داخل کړئ" />
                                </div>
                            </div>
                            <div class="col-lg-5 col-md-6 col-sm-12 col-xs-12 pull-right">
                                <div class="form-group form-group-sm">
                                    <label for="owner_info">د مالک پیژندنه</label>
                                    <input type="text" class="form-control text-right" readonly="readonly"
                                        id="owner_info" name="owner_info" />
                                </div>
                            </div>

                            <div class="col-lg-1">
                            </div>
                        </div>
                        <hr>
                        <div class="row">
                            <div class="col-lg-3 col-md-6 col-sm-12 col-xs-12 pull-right">
                                <h5>دضامن معلومات داخل کړئ</h5>
                                <div class="form-group form-group-sm ">
                                    <label for="sponser_name">ضامن نوم </label>
                                    <input type="text" placeholder="د ضامن پښتو نوم"
                                        value="{{ $edit_sponsor->sponser_name }}" class="form-control text-right"
                                        id="sponser_name" name="sponser_name" required="required"
                                        pattern="[آاأبپتټثجحخچڅځدذډرزؤوړږسښشصضطظعغفقکګلمنڼږهءیيې۰ئۍ\s]*"
                                        title="یوازې پښتو الفبا توري داخل کړئ" />
                                </div>

                                <div class="form-group form-group-sm">
                                    <label for="sponsor_fname">د پلار نوم</label>
                                    <input type="text" placeholder="د ضامن د پلار پښتو نوم"
                                        value="{{ $edit_sponsor->sponsor_fname }}" class="form-control" id="sponsor_fname"
                                        name="sponsor_fname" required="required"
                                        pattern="[آاأبپتټثجحخچڅځدذډرړزؤوږسشښصضطظعغفقکګلمنڼږهءی۰يېئۍ\s]*"
                                        title="یوازې پښتوالفبا توري داخل کړئ" />
                                </div>
                                <div class="form-group form-group-sm ">
                                    <label for="phone_number">د موبایل نمبر</label>
                                    <input type="text" value="{{ $edit_sponsor->phone_number }}" name="phone_number"
                                        class="form-control" id="phone_number" pattern="[۰-۹]*[0-9]*"
                                        title="یوازې نمبر داخل کړئ" />
                                </div>

                                <div class="form-group form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                                    <label for="">جنسیت</label><br>
                                    <select name="gender" id="" class="form-controll form-controll -sm p-2">
                                        <option {{ $edit_sponsor->gender == 'نارینه' ? 'selected' : '' }} value="نارینه">
                                            نارینه</option>
                                        <option {{ $edit_sponsor->gender == 'ښځینه' ? 'selected' : '' }} value="ښځینه">
                                            ښځینه</option>
                                    </select>

                                </div>
                            </div>
                            <div class="col-lg-3 col-md-6 col-sm-12 col-xs-12 pull-right">
                                <h5 class="text-center"> د عکس اپلوډ</h5>
                                <div class="form-group form-group-sm">
                                    <label for="approval_barharli">د برحالۍ تائیدي</label>
                                    <textarea class="form-control" rows="4" name="approval_barharli" id="approval_barharli">{{ $edit_sponsor->approval_barharli }}</textarea>
                                </div>


                                <div class="form-group form-group-sm">
                                    <label for="sponsor_image">د ضامن عکس</label>
                                    <input id="std_img" class="form-control" type="file" onchange="loadFile(event)"
                                        name="sponsor_image" id="sponsor_image" />
                                </div>

                                <div class="form-group form-group-sm text-center">
                                    <img id="output"
                                        src="{{ asset('upload/sponsor/' . $edit_sponsor->sponsor_image) }}"
                                        id="selected_img" alt="Preview" height="100" width="87" />
                                </div>

                            </div>
                            <div class="col-lg-3 col-md-12 col-sm-12 col-xs-12 pull-right">
                                <h5 class="text-center">د ضامن اصلی سکونت</h5>
                                <div class="form-group form-group-sm">
                                    <label for="pro">ولایت</label>

                                    <select class="form-control" id="per_pro_id" name="permenant_prov_add">
                                        <option value="{{ $edit_sponsor->permenant_prov_add }}">
                                            {{ $edit_sponsor->per_province->name }}</option>
                                        @foreach ($per_provinces as $province)
                                            <option value="{{ $province->id }}">{{ $province->name }}</option>
                                        @endforeach
                                    </select>
                                </div>
                                <div class="form-group form-group-sm">
                                    <label for="dis">ولسوالی</label>
                                    <select class="form-control" id="permenant_dis_add" name="permenant_dis_add">
                                        <option value="{{ $edit_sponsor->permenant_dis_add }}">
                                            {{ $edit_sponsor->per_disrict->name }}</option>
                                    </select>
                                </div>
                                <div class="form-group form-group-sm">
                                    <label for="permenant_village">کلی</label>
                                    <input type="text" value="{{ $edit_sponsor->permenant_village }}"
                                        name="permenant_village" class="form-control" id="vil"
                                        pattern="[A-Za-z\s]*[آاأبپتټثجحخچڅځدذډرزوؤړږسښشصضطظعغفقکګلمنڼږهءیيېئۍ۰\s]*"
                                        title="یوازې الفبا توري داخل کړئ" />
                                </div>

                            </div>

                            <div class="col-lg-3 col-md-6 col-sm-12 col-xs-12">
                                <h5 class="text-center">د ضامن فعلی سکونت</h5>

                                <div class="form-group form-group-sm">
                                    <label for="">ولایت</label>
                                    <select class="form-control" id="cur_pro_id" name="current_prov_add">
                                        <option value="{{ $edit_sponsor->current_prov_add }}">
                                            {{ $edit_sponsor->cur_province->name }}</option>
                                        @foreach ($cur_provinces as $province)
                                            <option value="{{ $province->id }}">{{ $province->name }}</option>
                                        @endforeach
                                    </select>
                                </div>
                                <div class="form-group form-group-sm">
                                    <label for="">ولسوالی</label>
                                    <select class="form-control" id="current_dis_add" name="current_dis_add">
                                        <option value="{{ $edit_sponsor->current_dis_add }}">
                                            {{ $edit_sponsor->cur_district->name }}</option>
                                    </select>
                                </div>
                                <div class="form-group form-group-sm">
                                    <label for="current_village">کلی</label>
                                    <input type="text" value="{{ $edit_sponsor->current_village }}"
                                        name="current_village" class="form-control" id="current_village"
                                        pattern="[A-Za-z\s]*[۰آاأبپتټثجحخچڅځدذډرزؤړوږښسشصضطظعغفقکګلمنڼږهءیيېئۍ\s]*"
                                        title="یوازې الفبا توري داخل کړئ" />
                                </div>
                                <input type="submit" class="btn btn-primary btn-md" id="submit" value=" تغیرول"
                                    name="submit" />
                                <a href="{{ route('sponser.index') }}" class="btn btn-success btn-md">واپس تلل</a>
                            </div>
                            <div class="clearfix"></div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </section>


@endsection


@section('pageJs')

    <script>
        $("#owner_code").blur(function() {
            var owner_code = $(this).val();
            // alert(owner_code);
            return false;
            $.ajax({
                url: 'ajax/fill_owner',
                type: 'GET',
                cache: false,
                async: false,
                data: {
                    'owner_code': owner_code
                },
                success: function(data) {
                    $("#owner_info").val(data);
                    // alert(data);
                },
                error: function() {
                    alert("error");
                }
            });
        });



        $("#per_pro_id").change(function() {
            var province_id = $(this).val();
            $.ajax({
                url: '/ajax/fill_per_district',
                type: 'GET',
                cache: false,
                async: false,
                data: {
                    'province_id': province_id
                },
                success: function(data) {
                    $('#permenant_dis_add').html(data);
                    // alert(data);

                },
                error: function() {
                    alert('error');
                }
            });
        });

        $("#cur_pro_id").change(function() {
            var cur_pro_id = $(this).val();
            $.ajax({
                url: '/ajax/fill_cur_district',
                type: 'GET',
                cache: false,
                async: false,
                data: {
                    'cur_pro_id': cur_pro_id
                },
                success: function(data) {
                    $('#current_dis_add').html(data);
                    // alert(data);
                },
                error: function() {
                    alert('error');
                }
            });
        });
    </script>

@endsection
