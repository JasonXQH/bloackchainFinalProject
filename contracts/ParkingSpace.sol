// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.18 <0.9.0;

interface test {
    //这里面的方法一定要是我们调用的B合约中的test方法，参数什么的也都保持一致。
    //因为是interface，所以函数必须声明为external
    function timeCalculator(address _to, uint256 _value)
        external
        returns (bool);
}

contract ParkingSpace {
    //车位状态[已拥有(永久)、可预订(空闲)、已预订]
    enum State {
        Purchased,
        Booked,
        Available
    }
    test timeCalculator;

    struct Space {
        uint256 id; // 在合约中的编码
        bytes16 parkNumber; // 车位编号(商场ID+车位编号，如: 01A001表明K11商场A001号车位)
        uint256 startTimeStamp; // 开始租赁的时间 unix毫秒
        uint256 price; // 租金
        bytes32 proof; // 32
        address owner; // 使用权所有者
        bool valid;
        State state; // 1
    }
    // mapping of parkHash to Parking Space
    mapping(bytes32 => Space) private bookedParkingSpace;
    // mapping of parkNumber to parkHash
    mapping(uint256 => bytes32) private bookedParkingSpaceHash;
    // number of all booked Parking Space
    uint256 private totalBookedParkingSpace;

    address payable private owner;

    constructor() {
        setContractOwner(msg.sender);
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

    function releasePark(bytes16 _parkNumber) public onlyOwner {
        //获取哈希值
        bytes32 parkHash = keccak256(abi.encodePacked(_parkNumber, msg.sender));
        //如果不存在，直接返回
        if (!bookedParkingSpace[parkHash].valid) {
            return;
        }
        Space memory target = bookedParkingSpace[parkHash];
        // 如果存在,删除映射关系
        delete bookedParkingSpace[parkHash];
        delete bookedParkingSpaceHash[target.id];
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
}
