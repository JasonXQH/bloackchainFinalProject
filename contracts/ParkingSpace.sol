// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.18 <0.9.0;

contract ParkingSpace {
    //车位状态[已拥有(永久)、可预订(空闲)、已预订]
    enum State {
        Booked,
        Available
    }

    struct Space {
        uint256 id; // 在合约中的编码
        bytes16 parkNumber; // 车位编号(商场ID+车位编号，如: 01A001表明K11商场A001号车位)
        uint256 startTimeStamp; // 开始租赁的时间 unix毫秒
        uint256 price; // 定金
        bytes32 proof; // bytes32
        address owner; // 使用权所有者
        bool valid;
        State state; // 1
    }
    struct General {
        bytes16 parkNumber; // 车位编号(商场ID+车位编号，如: 01A001表明K11商场A001号车位)
        address owner; // 所有权(默认都是owner的)，租出去的时候是用户的，归还的时候是合约作者的
        State state; // 1
    }

    Space[] OwnedParkings;
    General[] ParkingPool;

    string[] private mallNumberList;
    string[] private spaceNumberList;

    // mapping of parkHash to Parking Space
    mapping(bytes32 => Space) private bookedParkingSpace;
    // mapping of parkNumber to parkHash
    mapping(uint256 => bytes32) private bookedParkingSpaceHash;
    mapping(bytes16 => uint256) private GeneralArrayRetreiver;
    // number of all booked Parking Space
    uint256 private totalBookedParkingSpace;
    uint256 private ParkingSpaceCount = 0;
    address payable private owner;

    constructor() {
        setContractOwner(msg.sender);
        _getMallNumberList();
        _getSpaceNumberList();
        for (uint8 i = 0; i < mallNumberList.length; i++) {
            for (uint8 j = 0; j < spaceNumberList.length; j++) {
                bytes16 parkNumber = bytes16(
                    bytes(string.concat(mallNumberList[i], spaceNumberList[j]))
                );
                GeneralArrayRetreiver[parkNumber] = ParkingSpaceCount;
                ParkingPool.push(
                    General({
                        parkNumber: parkNumber,
                        owner: owner,
                        state: State.Available
                    })
                );
                GeneralArrayRetreiver[parkNumber] = ParkingSpaceCount;
                ParkingSpaceCount++;
            }
        }
    }

    error ParkHasOwner();
    error OnlyOwner();

    // 修饰器，用其修饰的函数只允许owner操作
    modifier onlyOwner() {
        if (msg.sender != getContractOwner()) {
            revert OnlyOwner();
        }
        _;
    }

    function releasePark(bytes16 _parkNumber) public {
        //获取哈希值
        bytes32 parkHash = keccak256(abi.encodePacked(_parkNumber, msg.sender));
        //如果不存在，直接返回
        if (!bookedParkingSpace[parkHash].valid) {
            return;
        }
        Space memory target = bookedParkingSpace[parkHash];
        // 如果存在,删除映射关系
        uint256 parkIndex = target.id;
        uint256 lastParkIndex = OwnedParkings.length - 1;
        if (parkIndex == lastParkIndex) {
            OwnedParkings.pop();
            delete bookedParkingSpace[parkHash];
            delete bookedParkingSpaceHash[parkIndex];
        } else {
            // 最后一个换上来
            OwnedParkings[parkIndex] = OwnedParkings[lastParkIndex];
            OwnedParkings.pop();
            //修改 两个map
            bytes32 lastParkHash = keccak256(
                abi.encodePacked(
                    OwnedParkings[parkIndex].parkNumber,
                    msg.sender
                )
            );
            bookedParkingSpaceHash[parkIndex] = lastParkHash;
            // 删除被删除元素的映射index
            delete bookedParkingSpace[parkHash];
            delete bookedParkingSpaceHash[parkIndex];
        }
        ParkingPool[GeneralArrayRetreiver[_parkNumber]].owner = owner;
        ParkingPool[GeneralArrayRetreiver[_parkNumber]].state = State.Available;
        totalBookedParkingSpace--;
    }

    function bookPark(bytes16 _parkNumber, bytes32 proof)
        external
        payable
        returns (bytes32)
    {
        //比如说，parkNumber= 01A001，那么bytes16就是：0x00000000000000000000484965484849
        //proof:0x0000000000000000000048496548484900000000000000000000484965484849
        //address=0x5B38Da6a701c568545dCfcB03FcB875f56beddC4

        //hash输入0x000000000000000000004849654848495B38Da6a701c568545dCfcB03FcB875f56beddC4
        //keccak输出: 0xd795db9290f77fe7d947409e98cb61c34c31603fc7c066356532aca15c706dcb
        bytes32 parkHash = keccak256(abi.encodePacked(_parkNumber, msg.sender));

        if (hasParkOwnership(parkHash)) {
            revert ParkHasOwner();
        }

        ParkingPool[GeneralArrayRetreiver[_parkNumber]].owner = msg.sender;
        uint256 id = totalBookedParkingSpace++;
        bookedParkingSpaceHash[id] = parkHash;
        bookedParkingSpace[parkHash] = Space({
            id: id,
            parkNumber: _parkNumber,
            price: msg.value,
            proof: proof,
            valid: true,
            owner: msg.sender,
            startTimeStamp: block.timestamp,
            state: State.Booked
        });
        OwnedParkings.push(bookedParkingSpace[parkHash]);
        ParkingPool[GeneralArrayRetreiver[_parkNumber]].state = State.Booked;
        return parkHash;
    }

    // 换新的合约主人
    function transferOwnership(address newOwner) external onlyOwner {
        setContractOwner(newOwner);
    }

    // 获取当前合约主人
    function getContractOwner() public view returns (address) {
        return owner;
    }

    // 获取当前有的车位数量(使用权)
    function getParkCount() external view returns (uint256) {
        return totalBookedParkingSpace;
    }

    // 获取当前有的车位数量(使用权)
    function getOwnedParkList() external view returns (Space[] memory) {
        return OwnedParkings;
    }

    //获取所有停车场信息
    function getParkingPool() external view returns (General[] memory) {
        return ParkingPool;
    }

    //获取某一车位general的信息
    function getGeneralParking(string memory _parkNumberString)
        external
        view
        returns (General memory)
    {
        bytes16 key = bytes16(bytes(_parkNumberString));
        return ParkingPool[GeneralArrayRetreiver[key]];
    }

    // 用index获取parkHash
    function getParkHashAtIndex(uint256 index) external view returns (bytes32) {
        return bookedParkingSpaceHash[index];
    }

    // 用parkHash获取Space结构
    function getParkByHash(bytes32 _parkHash)
        external
        view
        returns (Space memory)
    {
        return bookedParkingSpace[_parkHash];
    }

    // 设置当前合约主人
    function setContractOwner(address newOwner) private {
        owner = payable(newOwner);
    }

    // 判断当前调用者是否有车位的使用权
    function hasParkOwnership(bytes32 _parkHash) private view returns (bool) {
        return bookedParkingSpace[_parkHash].owner == msg.sender;
    }

    function _getMallNumberList() private {
        mallNumberList.push("01");
        mallNumberList.push("02");
        mallNumberList.push("03");
        mallNumberList.push("04");
    }

    function _getSpaceNumberList() private {
        spaceNumberList.push("A001");
        spaceNumberList.push("A002");
        spaceNumberList.push("A003");
        spaceNumberList.push("A004");
        spaceNumberList.push("A005");
        spaceNumberList.push("A006");
        spaceNumberList.push("A007");
        spaceNumberList.push("A008");
        spaceNumberList.push("A009");
        spaceNumberList.push("A010");
    }
}
