{{-- @extends('layouts.app')
@section('title','د مالک معلومات تغیرول')
@section('content')
<br>
<!-- Main content -->
<section class="content" style="font-family: Bahij Zar;">
    <div class="container-fluid">

        <div class="card" style="border-radius: 0px;;">
            <div class="row" style="margin-top:20px;">

                <div class="col-lg-6" style="text-align: right;">
                    <h5 style="font-family: Bahij Titra; margin-right: 30px;">شرکت ترانســـــــپورټي ریکـــــشه راني بـابـا </h5>
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
            <hr>
            <div class="card card-header" style="background-color: lightgray; border-radius:0px;">
                <h5 style="text-align: center;"> د مالک معلومات تغیرول </h5>
            </div>
            <div id="owner_card_body" class="card-body" style="text-align:right;">
                <form method="post" action="{{route('owner.update',$edit_owner)}}" enctype="multipart/form-data" dir="rtl">
                    @csrf
                    @method('PUT')
                    <div class="row">
                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 pull-left text-right">
                            <h5 class="text-center">د مالک شهرت</h5>
                            <div class="form-group form-group-sm">
                                <label for="owner_code" style="align-content: center;">د مالک خاص نمبر چې هر يو یی باید په یاد ولري</label>
                                <input type="text" readonly="readonly" class="form-control" id="owner_code" value="{{$edit_owner->id}}" name="student_code" required="required" />
                            </div>

                            <div class="row">
                                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 pull-left text-right">
                                    <label for="name">نوم<span style="color: red"> * </span></label>
                                    <input type="text" placeholder="د  مالک  نوم" class="form-control text-right"  id="name" name="name" required="required" pattern="[آاأبپتټثجحخچڅځدذډرزؤوړږسښشصضطظعغفقکګلمنڼږهءیيې۰ئۍ\s]*" title="یوازې پښتو الفبا توري داخل کړئ" />
                                </div>
                                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 pull-left text-right">
                                    <label for="last_name">تخلص<span style="color: red"> * </span></label>
                                    <input type="text" placeholder="د مالک  تخلص نوم" class="form-control text-right" value="{{$edit_owner->last_name}}" id="last_name" name="last_name" required="required" pattern="[آاأبپتټثجحخچڅځدذډرزؤوړږسښشصضطظعغفقکګلمنڼږهءیيې۰ئۍ\s]*" title="یوازې پښتو الفبا توري داخل کړئ" />
                                </div>
                                <div class="form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                                    <label for="father_name">د پلار نوم<span style="color: red"> * </span></label>
                                    <input type="text" placeholder=" د پلار  نوم" class="form-control" id="father_name" value="{{$edit_owner->father_name}}" name="father_name" required="required" pattern="[آاأبپتټثجحخچڅځدذډرړزؤوږسشښصضطظعغفقکګلمنڼږهءی۰يېئۍ\s]*" title="یوازې پښتوالفبا توري داخل کړئ" />
                                </div>
                                <div class="form-group form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                                    <label for="grand_fname">د نیکه نوم<span style="color: red"> * </span></label>
                                    <input type="text" placeholder=" د نیکه  نوم" class="form-control" id="grand_father" value="{{$edit_owner->grand_fname}}" required="required" name='grand_fname' pattern="[آاأبپتټثجحخچڅځدذډرړزؤوږسښشصضطظعغفقکګلمنڼږهءیي۰ېئۍ\s]*" title="یوازې پښتو الفبا توري داخل کړئ" />
                                </div>
                                <div class="form-group form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                                <label>Gender:</label>
<select name="gender" required>
    <option value="male">Male</option>
    <option value="female">Female</option>
    <option value="other">Other</option>
</select>

                                <div class="form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                                    <label for="owner_job">د مالک دنده</label>
                                    <input type="text" value="{{$edit_owner->owner_job}}" placeholder="مالک دنده" class="form-control" id="owner_job" name="owner_job" required="required" pattern="[A-Za-z\s]*[آاأبپتټثجحخچڅځدذډرزؤوړږسښشصضطظعغفقکګلمنڼږهءیيېئ۰ۍ\s]*" title="یوازې الفبا توري داخل کړئ" />
                                </div>

                                <div class="form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                                    <label for="job_place">د مالک دندي ځای</label>
                                    <input type="text" placeholder="دندي ځای" value="{{$edit_owner->job_place}}" class="form-control" id="job_place" name="job_place" pattern="[A-Za-z\s]*[آاأبپتټثجحخچڅځدذډرزؤوړږسښشصضطظعغفقکګلمنڼږهءیيېئ۰ۍ\s]*" title="یوازې الفبا توري داخل کړئ" />
                                </div>

                                <div class="form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                                    <label for="nic_number">د تذکیرې نمبر<span style="color: red"> * </span></label>
                                    <input type="text" value="{{$edit_owner->nic_number}}" placeholder="تزکري نمبر" name="nic_number" class="form-control" onkeypress="return isNumber()" id="nic_number" required="required" pattern="[۰-۹]*[0-9]*" title="یوازې نمبر داخل کړئ" />
                                    <div style="color:red;">{{$errors->first('nic_number')}}</div>
                                </div>

                                <div class="form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                                    <label for="phone_number">د موبایل نمبر<span style="color: red"> * </span></label>
                                    <input type="text" value="{{$edit_owner->phone_number}}" placeholder="موبایل نمبر" name="phone_number" class="form-control" onkeypress="return isNumber()" id="phone_number" required="required" pattern="[۰-۹]*[0-9]*" title="یوازې نمبر داخل کړئ" />
                                    <div style="color:red"> {{$errors->first('phone_number')}}</div>
                                </div>

                            </div>

                        </div>

                        <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12 pull-right">

                            <div class="form-group form-group-sm  ">
                                <label for="house_no">کور نمبر</label>
                                <input type="text" value="{{$edit_owner->house_no}}" name="house_no" class="form-control" onkeypress="return isNumber()" id="house_no" pattern="[0-9]*" title="یوازې نمبر داخل کړئ" />
                            </div>
                            <div class="form-group form-group-sm">
                                <label for="description">توضیحات<span style="color: red"> * </span></label>
                                <textarea class="form-control" rows="11" placeholder="توضیحات" name="description" required="required" id="description">{{$edit_owner->description}}</textarea>
                                <div style="color:red"> {{$errors->first('description')}}</div>
                            </div>

                        </div>

                        <div class="col-lg-3 col-md-12 col-sm-12 col-xs-12 pull-right">
                            <h5 class="text-center">د مالک اصلی سکونت</h5>
                            <div class="form-group form-group-sm">
                                <label for="pro">ولایت</label>
                                <select class="form-control" id="per_pro_id" name="permenant_prov_add">
                                    <option value="{{$edit_owner->permenant_prov_add}}">{{$edit_owner->per_province->name}}</option>
                                    @foreach ($provinces as $province)
                                    <option value="{{$province->id}}">{{$province->name}}</option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="form-group form-group-sm">
                                <label for="pro">ولسوالي</label>
                                <select class="form-control" id="permenant_dis_add" name="permenant_dist_add">
                                    <option value="{{$edit_owner->permenant_dist_add}}">{{$edit_owner->per_disrict->name}}</option>
                                </select>
                            </div>
                            <div class="form-group form-group-sm">
                                <label for="permenant_village">کلی</label>
                                <input type="text" name="permenant_village" value="{{$edit_owner->permenant_village}}" class="form-control" id="vil" pattern="[A-Za-z\s]*[آاأبپتټثجحخچڅځدذډرزوؤړږسښشصضطظعغفقکګلمنڼږهءیيېئۍ۰\s]*" title="یوازې الفبا توري داخل کړئ" />
                            </div>
                            <h5 class="text-center">د مالک فعلی سکونت</h5>

                            <div class="form-group form-group-sm">
                                <label for="pro">ولایت</label>
                                <select class="form-control" id="cur_pro_id" name="current_prov_add" />
                                <option value="{{$edit_owner->current_prov_add}}">{{$edit_owner->cur_province->name}}</option>
                                @foreach ($cur_provinces as $province)
                                <option value="{{$province->id}}">{{$province->name}}</option>
                                @endforeach
                                </select>
                            </div>
                            <div class="form-group form-group-sm">
                                <label for="pro">ولسوالي</label>
                                <select class="form-control" id="current_dis_add" name="current_dis_add">
                                    <option value="{{$edit_owner->current_dist_add}}">{{$edit_owner->cur_district->name}}</option>
                                </select>
                            </div>
                            <div class="form-group form-group-sm">
                                <label for="current_village">کلی</label>
                                <input type="text" name="current_village" value="{{$edit_owner->current_village}}" class="form-control" id="current_village" pattern="[A-Za-z\s]*[۰آاأبپتټثجحخچڅځدذډرزؤړوږښسشصضطظعغفقکګلمنڼږهءیيېئۍ\s]*" title="یوازې الفبا توري داخل کړئ" />
                            </div>
                        </div>

                    </div>
                    <h5 class="text-center">د عکس اپلوډ &nbsp;<i id="show_documents" class="fa fa-plus"></i></h5>
                    <hr />
                    <div id="frm" class="row">
                        <div class="col-lg-4 col-mg-6 col-sm-12 col-xs-12">
                            <div class="form-group form-group-sm">
                                <label for="image">د مالک عکس<span style="color: red"> * </span></label>
                                <input class="form-control" type="file" value="{{$edit_owner->image}}" onchange="loadFile(event)" name="image" id="image" />
                            </div>

                            <div class="form-group form-group-sm text-center">
                                <img id="output" src="{{asset('upload/owner/image/'.$edit_owner->image)}}" id="selected_img" alt="Preview" height="100" width="87" />
                            </div>
                        </div>


                    </div>
                    <div class="text-left">
                        <input type="submit" class="btn btn-default btn-md" id="submit" value="تغیر کول" name="submit" />
                        <a href="{{route('owner.index')}}" class="btn btn-default btn-md">واپس تلل</a>
                    </div>
                </form>
            </div>

        </div>
    </div>
</section>


@endsection


@section('pageJs')

<script>
    $("#per_pro_id").change(function() {
        var province_id = $(this).val();
        // alert(province_id);
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

--}}

-@extends('layouts.app')
@section('title','د مالک معلومات تغیرول')
@section('content')
<br>
    <!-- Main content -->
    <section class="content" style="font-family: Bahij Zar;">
        <div class="container-fluid">
            <div class="card">
                <div class="row" style="margin-top:20px;">
                    <div class="col-lg-6" style="text-align: right;">
                        <h3 style="font-family: Bahij Titra; margin-right: 30px;">شرکت ترانســـــــپورټي ریکـــــشه راني
                            بـابـا </h3>
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
                <div class="card card-header" style="background-color:lightgray;">
                    <div class="row">
                        <div class="col-lg-10 col-md-10 col-sm-10 col-xs-10 pull-left">
                            <h4 style="text-align: center;"> مالک مغلومات نغیرول</h4>

                        </div>
                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 pull-left text-right">
                            <span id="owner_sign" class="btn btn-md" style="color:black;"><i
                                    class="fa fa-angle-down"></i></span>
                        </div>

                    </div>
                </div>

                <div id="owner_card_body" class="card-body" style="text-align:right;">
                    <form method="post"  action="{{route('owner.update',$edit_owner)}}" enctype="multipart/form-data" dir="rtl">
                        @csrf
                        @method('PUT')
                        <div class="row">
                            <div class="col-lm-6 col-md-12 col-sm-12 col-xs-12 pull-right">
                                <h5 class="text-center">د مالک شهرت</h5>

                                <div class="row">
                                    <div class="form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                                        <label for="name">نوم<span style="color: red"> * </span></label>
                                        <input type="text" value="{{$edit_owner->name}}" class="form-control text-right"
                                            id="name" name="name" required="required"
                                            pattern="[آاأبپتټثجحخچڅځدذډرزؤوړږسښشصضطظعغفقکګلمنڼږهءیيې۰ئۍ\s]*"
                                            title="یوازې پښتو الفبا توري داخل کړئ" />
                                    </div>
                                    <div class="form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                                        <label for="last_name">تخلص<span style="color: red"> * </span></label>
                                        <input type="text" value="{{$edit_owner->last_name}}" class="form-control text-right"
                                            id="last_name" name="last_name" required="required"
                                            pattern="[آاأبپتټثجحخچڅځدذډرزؤوړږسښشصضطظعغفقکګلمنڼږهءیيې۰ئۍ\s]*"
                                            title="یوازې پښتو الفبا توري داخل کړئ" />
                                    </div>
                                    <div class="form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                                        <label for="father_name">د پلار نوم<span style="color: red"> * </span></label>
                                        <input type="text" value="{{$edit_owner->father_name}}" class="form-control"
                                            id="father_name" name="father_name" required="required"
                                            pattern="[آاأبپتټثجحخچڅځدذډرړزؤوږسشښصضطظعغفقکګلمنڼږهءی۰يېئۍ\s]*"
                                            title="یوازې پښتوالفبا توري داخل کړئ" />
                                    </div>
                                    <div class="form-group form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                                        <label for="grand_fname">د نیکه نوم<span style="color: red"> * </span></label>
                                        <input type="text"  value="{{$edit_owner->grand_fname}}" class="form-control"
                                            id="grand_father" required="required" name='grand_fname'
                                            pattern="[آاأبپتټثجحخچڅځدذډرړزؤوږسښشصضطظعغفقکګلمنڼږهءیي۰ېئۍ\s]*"
                                            title="یوازې پښتو الفبا توري داخل کړئ" />
                                    </div>

                                    <div class="form-group form-group form-group-sm col-md-6 col-sm-6 col-xs-12">

                                        <label for="">جنسیت</label><br>
                                        <select class ="form-group form-group form-group-sm col-md-12 col-sm-12 col-xs-12" name="gender"  id="" class="form-controll form-controll -sm p-2">


                                            <option {{ ($edit_owner->gender == 'نارینه') ? 'selected' : '' }} value="نارینه">نارینه</option>
                                            <option {{ ($edit_owner->gender == 'ښځینه') ? 'selected' : '' }} value="ښځینه">ښځینه</option>
                                        </select>

                                    </div>


                                    <div class="form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                                        <label for="owner_job">د مالک دنده</label>
                                        <input type="text" value="{{$edit_owner->owner_job}}"  class="form-control"
                                            id="owner_job" name="owner_job" required="required"
                                            pattern="[A-Za-z\s]*[آاأبپتټثجحخچڅځدذډرزؤوړږسښشصضطظعغفقکګلمنڼږهءیيېئ۰ۍ\s]*"
                                            title="یوازې الفبا توري داخل کړئ" />
                                    </div>

                                    <div class="form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                                        <label for="job_place">د مالک دندي ځای</label>

                                        <input type="text" value="{{$edit_owner->job_place}}" class="form-control"
                                            id="job_place" name="job_place" />

                                        <label for="house_no">کور نمبر</label>

                                        <input type="text" value="{{$edit_owner->house_no}}" class="form-control" id=""
                                            name="house_no" required="required" pattern="[۰-۹]*[0-9]*"
                                            title="یوازې نمبر توري داخل کړئ" />
                                        <div style="color: red;"> {{ $errors->first('house_no') }}</div>

                                        <label for="phone_number">موبایل تمبر </label>
                                        <input type="text" value="{{$edit_owner->phone_number}}" class="form-control" id=""
                                            name="phone_number" required="required" pattern="[۰-۹]*[0-9]*"
                                            title="یوازې نمبر توري داخل کړئ" />
                                        <div style="color: red;"> {{ $errors->first('phone_number') }}</div>





                                        <h5 class="text-center">د مالک اصلی سکونت</h5>
                                        <div class="form-group form-group-sm">
                                            <label for="pro">ولایت</label>
                                            <select class="form-control" id="per_pro_id" required="required"
                                                name="permenant_prov_add">
                                                <option class="text-right" value="0" disabled>ولایت انتخاب کړئ</option>
                                                @foreach ($provinces as $province)
                                                {{-- <option {{  $province->id == $edit_owner->permenant_prov_add ? 'selected' : '' }} value="{{ $province->id  }}">{{ $province->name }}</option> --}}
                                                <option {{ $province->id == $edit_owner->permenant_prov_add ? 'selected' : ''  }} value="{{ $province->id }}">{{ $province->name }}</option>
                                                @endforeach
                                            </select>
                                        </div>

                                        <div class="form-group form-group-sm">
                                            <label for="dis">ولسوالی</label>
                                            <select class="form-control" id="permenant_dis_add" required="required"
                                                name="permenant_dist_add">
                                                <option value="" disabled>ولسوالی انتخاب کړی</option>
                                                @foreach ( $districts as  $district )
                                            <option {{  $district->id == $edit_owner->permenant_dist_add ? 'selected' : '' }} value="{{ $district->id  }}">{{ $district->name }}</option>

                                                @endforeach
                                            </select>
                                        </div>


                                        <div class="form-group form-group-sm">
                                            <label for="permenant_village">کلی</label>

                                            <input type="text" value="{{$edit_owner->permenant_village}}" name="permenant_village"
                                                class="form-control" id="vil"
                                                pattern="[A-Za-z\s]*[آاأبپتټثجحخچڅځدذډرزوؤړږسښشصضطظعغفقکګلمنڼږهءیيېئۍ۰\s]*"
                                                title="یوازې الفبا توري داخل کړئ" />



                                        </div>
                                    </div>

                                    <div class="form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                                        <label for="phone_number">د تذکیرې نمبر</label>
                                        <input type="text" value="{{$edit_owner->nic_number}}" class="form-control" id=""
                                            name="nic_number" required="required" pattern="[۰-۹]*[0-9]*"
                                            title="یوازې نمبر توري داخل کړئ" />
                                        <div style="color: red;"> {{ $errors->first('nic_number') }}</div>



                                        <label for="description">توضیحات<span style="color: red"> * </span></label>
                                        <textarea class="form-control" rows="4" name="description" required="required"
                                            id="description">{{$edit_owner->description}}</textarea>
                                        <div style="color:red"> {{ $errors->first('description') }}</div>



                                        <h5 class="text-center">د مالک فعلی سکونت</h5>

                                         <div class="form-group form-group-sm">
                                            <label for="pro2">ولایت</label>
                                            <select class="form-control" id="cur_pro_id" required="required"
                                                name="current_prov_add">
                                                <option class="text-right" value="0" disabled> </option>
                                                @foreach ($cur_provinces as $cur_province)
                                                    <option {{ $cur_province->id == $edit_owner->current_prov_add ? 'selected' : ''  }} value="{{ $cur_province->id }}">{{ $cur_province->name }}</option>
                                                @endforeach
                                            </select>
                                            <div style="color:red"> {{ $errors->first('current_prov_add') }}</div>
                                        </div>


                                        <div class="form-group form-group-sm">
                                            <label for="dis">ولسوالی</label>
                                            <select class="form-control" id="current_dis_add" required="required"
                                                name="current_dis_add">
                                                <option value="" disabled>ولسوالی انتخاب کړی</option>
                                                @foreach ( $cur_districts as  $cur_district )
                                            <option {{  $cur_district->id == $edit_owner->current_dis_add ? 'selected' : '' }}value="{{ $district->id  }}">{{ $district->name }}</option>

                                                @endforeach
                                            </select>
                                        </div>


                                        <div class="form-group form-group-sm">

                                            <div class="form-group form-group-sm">
                                                <label for="permenant_village">کلی</label>

                                                <input type="text" value="{{$edit_owner->current_village }}" name="current_village"
                                                    class="form-control" id="vil"
                                                    pattern="[A-Za-z\s]*[آاأبپتټثجحخچڅځدذډرزوؤړږسښشصضطظعغفقکګلمنڼږهءیيېئۍ۰\s]*"
                                                    title="یوازې الفبا توري داخل کړئ" />

                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>

                </div>
                <div class="col-lg-3 col-md-6 col-sm-12 col-xs-12 pull-right">

                    <div class="form-group form-group-sm">
                        <label for="owner_image">د مالک عکس</label>
                        <input id="owner_image" class="form-control" type="file" onchange="loadFile(event)"
                            name="image" />
                        <img id="output" class="img-thumbnail" style="margin-top: 10px;" height="150"
                            width="150" />
                    </div>

                </div>
            </div>
            <div class="text-left">
                <input type="submit" class="btn btn-primary btn-md" id="submit" value="تغیرول" name="submit" />


            </div>
            </form>
        </div>




        <div class="col-lg-12 col-md-12 col-sm-12 table-responsive">
            <style>
                #example tr th,
                #example tr td {
                    text-align: center;

                }
            </style>

        </div>
        </div>
        </div>
    </section>
@endsection
@section('pageJs')
    <script>
        $("#per_pro_id").change(function() {
            var province_id = $(this).val();
            // alert(province_id);
            $.ajax({
                url: 'ajax/fill_per_district',
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


        $("#frm").css("display", "none");

        $("#show_documents").click(function() {
            $("#frm").slideToggle();
        });

        $("#cur_pro_id").change(function() {
            var cur_pro_id = $(this).val();
            $.ajax({
                url: 'ajax/fill_cur_district',
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
