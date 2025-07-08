@extends('layouts.app')
@section('title', 'کارمند')
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
                <div class="card card-header" style="background-color: lightgray; ">
                    <h5 style="text-align: center; margin:0px; padding:0px;"> نوي کارمند ثبت کول </h5>
                </div>
                <div class="card-body" style="text-align:right;">

                    <form id="frm_user" action="{{ route('user.store') }}" method="post" enctype="multipart/form-data"
                        dir="ltr">
                        @csrf
                        <div class="col-lg-3 col-md-12 col-sm-12 col-xs-12 pull-right">

                        </div>

                        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 pull-right text-left">
                            <h5 class="text-center">ټول معلومات په انګلیسي ژبه داخل کړئ</h5>

                            <div class="form-group form-group-sm">
                                <!-- <label for="dis2">Name</label> -->
                                <input type="text" id="name" name="name" class="form-control"
                                    placeholder="Enter First Name" required="required" />
                                <div style="color: red;">{{ $errors->first('name') }}</div>
                            </div>
                            <div class="form-group form-group-sm">
                                <!-- <label for="dis2">last_name</label> -->
                                <input type="text" id="last_name" name="last_name" class="form-control"
                                    placeholder="Enter Second Name" />
                                <div style="color: red;">{{ $errors->first('last_name') }}</div>
                            </div>
                            <label>
                                Gender
                            </label>
                            <select class="form-group form-group-sm col-md-12 col-md-12 col-xs-12" name="gender" required>
                                <option value="male">Male</option>
                                <option value="female">Female</option>

                            </select>


                            <div class="form-group form-group-sm">
                                <!-- <label for="dis2">Email</label> -->
                                <input type="email" id="email" name="email" class="form-control"
                                    placeholder="Your Email" required="required" />
                                <div style="color: red;">{{ $errors->first('email') }}</div>

                            </div>
                            <div class="form-group form-group-sm">
                                <!-- <label for="dis2">Phone Number</label> -->
                                <input type="text" id="phone" name="phone_number" class="form-control"
                                    placeholder="Your Phone" pattern="[۰-۹]*[0-9]*" required="required" />
                                <div style="color: red;">{{ $errors->first('phone_number') }}</div>
                            </div>
                            <div class="form-group">
                                <!-- <label for="dis2">User Type</label> -->
                                <select class="form-control" id="type" name="user_type">
                                    <option class="text-right" value="">--Select User Type--</option>
                                    <option class="text-right" value="Administrator">Administrator</option>
                                    <option class="text-right" value="employee">employee</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <!-- <label for="dis2">User Status</label> -->
                                <select class="form-control" id="state" name="status">
                                    <option class="text-right" value="">--User State--</option>
                                    <option class="text-right" value="1">On</option>
                                    <option class="text-right" value="0">Off</option>
                                </select>
                            </div>
                            <div class="form-group form-group-sm">
                                <!-- <label for="">Password</label> -->
                                <input type="password" id="password" name="password" class="form-control"
                                    placeholder="Enter Password" required="required" />
                                <div style="color: red;">{{ $errors->first('password') }}</div>
                            </div>
                            <div class="form-group form-group-sm">
                                <!-- <label for="">Confirm Password</label> -->
                                <input type="password" id="password_cofirmation" name="password_cofirmation"
                                    class="form-control" placeholder="Retype Password" required="required" />
                            </div>
                            <div class="form-group form-group-sm">
                                <!-- <label for="image">Select Image</label> -->
                                <input class="form-control" type="file" onchange="loadFile(event)" name="image"
                                    id="image" />
                                <div style="color:red"> {{ $errors->first('image') }}</div>
                            </div>

                            <div class="form-group form-group-sm text-center">
                                <img id="output" src="{{ asset('icons/file_icon.png') }}" id="selected_img"
                                    alt="Preview" height="100" width="87" />
                            </div>

                            <input type="submit" name="submit" id="submit" class="btn btn-md bg-success"
                                value="Register" />
                        </div>
                        <div class="col-lg-3 col-md-12 col-sm-12 col-xs-12 pull-right">

                        </div>
                        <div class="clearfix"></div>
                </div>

                </form>


                <div class="col-lg-12 col-md-12 col-sm-12">
                    <hr style="border-bottom: 2px gray solid;" />
                    <h3 class="text-center">د ټولو کارمندانو لېست</h3>
                    <hr>
                </div>
                <div class="col-lg-12 col-md-12 col-sm-12 table-responsive">
                    <style>
                        #example tr th,
                        #example tr td {
                            text-align: center;
                        }
                    </style>
                    <table id="example" class="table  table-bordered text-right" width="100%" dir="ltr"
                        cellspacing="0">
                        <thead class="bg-gray">
                            <tr>
                                <th>No</th>
                                <th>Name</th>
                                <th>Second Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>User Type</th>
                                <th>User State</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($get_users as $user)
                                <tr>
                                    <td>{{ $user->id }}</td>
                                    <td>{{ $user->name }}</td>
                                    <td>{{ $user->last_name }}</td>
                                    <td>{{ $user->email }}</td>
                                    <td>{{ $user->phone_number }}</td>
                                    <td>{{ $user->user_type }}</td>
                                    <td>
                                        <a href="users/{{ $user->id }}"
                                            class="btn btn-sm  btn-{{ $user->status ? 'success' : 'danger' }}">
                                            {{ $user->status ? 'Active' : 'Inactive' }}
                                            <!-- <i class="fa fa-edit"></i> -->
                                        </a>
                                    </td>

                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        </div>
    </section>


@endsection


@section('pageJs')

    <script>
        $("#owner_code").blur(function() {
            var owner_code = $(this).val();
            //alert(medicineId);
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
    </script>

@endsection
